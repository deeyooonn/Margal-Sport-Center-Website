import { useEffect, useState } from 'react';
import { supabase, supabaseConfigured, type Booking } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for booking CRUD.
 * When Supabase is not configured, reads from localStorage (demo mode).
 */
export function useBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyBookings = async () => {
    // ── Demo mode: read from localStorage ─────────────────────────────────
    if (!supabaseConfigured || !user) {
      try {
        const stored = localStorage.getItem('margal_confirmed_bookings');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Convert localStorage format to Booking shape
          const mapped: Booking[] = parsed.map((b: any) => ({
            id: b.id,
            user_id: 'demo',
            booking_date: new Date(b.date).toISOString().split('T')[0],
            time_slots: b.slots || [],
            total_amount: b.total || 0,
            status: 'upcoming' as const,
            customer_name: null,
            customer_phone: null,
            notes: null,
            created_at: b.date || new Date().toISOString(),
          }));
          setBookings(mapped);
        }
      } catch (e) {
        console.error('Error reading localStorage bookings', e);
      }
      return;
    }

    // ── Supabase mode ──────────────────────────────────────────────────────
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setBookings((data as Booking[]) ?? []);
    }
    setLoading(false);
  };

  /**
   * Fetch all bookings for a specific date (for slot availability grid).
   */
  const fetchBookingsForDate = async (date: Date): Promise<Booking[]> => {
    if (!supabaseConfigured || !user) return [];

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_date', dateStr)
      .neq('status', 'cancelled');

    if (error) {
      console.error('fetchBookingsForDate error:', error.message);
      return [];
    }
    return (data as Booking[]) ?? [];
  };

  /**
   * Create a new booking.
   */
  const createBooking = async (payload: {
    booking_date: string;
    time_slots: { id: string; timeLabel: string; hour: number; rate: number }[];
    total_amount: number;
    customer_name?: string;
    customer_phone?: string;
    notes?: string;
  }): Promise<Booking | null> => {
    if (!supabaseConfigured || !user) return null;

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        booking_date: payload.booking_date,
        time_slots: payload.time_slots,
        total_amount: payload.total_amount,
        status: 'upcoming',
        customer_name: payload.customer_name ?? null,
        customer_phone: payload.customer_phone ?? null,
        notes: payload.notes ?? 'Booked via Web Portal',
      })
      .select()
      .single();

    if (error) {
      console.error('createBooking error:', error.message);
      return null;
    }

    const newBooking = data as Booking;
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  /**
   * Admin only: update a booking.
   */
  const updateBooking = async (
    bookingId: string,
    updates: Partial<Pick<Booking, 'status' | 'customer_name' | 'customer_phone' | 'notes'>>
  ): Promise<boolean> => {
    if (!supabaseConfigured) return false;
    const { error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId);
    if (error) {
      console.error('updateBooking error:', error.message);
      return false;
    }
    await fetchMyBookings();
    return true;
  };

  /**
   * Cancel a booking.
   */
  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    if (!supabaseConfigured) return false;
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);
    if (error) {
      console.error('cancelBooking error:', error.message);
      return false;
    }
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    return true;
  };

  useEffect(() => {
    fetchMyBookings();
  }, [user]);

  return {
    bookings,
    loading,
    error,
    fetchMyBookings,
    fetchBookingsForDate,
    createBooking,
    updateBooking,
    cancelBooking,
  };
}
