import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Shield,
  Edit3,
  Unlock,
  Lock,
  User,
  Phone,
  Trash2,
  X,
  Save,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

// Types
type SlotStatus = 'available' | 'booked' | 'selected';

interface TimeSlot {
  id: string;
  timeLabel: string;
  hour: number;
  rate: number;
  status: SlotStatus;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
}

const DAY_RATE = 300; // 8AM - 6PM
const NIGHT_RATE = 400; // 6PM - 12MN

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

const getDateKey = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export function Booking() {
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  // Auto-detect role from localStorage user profile
  const [isAdmin] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('margal_user_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.role === 'admin';
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  // Global Bookings Database State
  const [bookings, setBookings] = useState<Record<string, TimeSlot[]>>({});

  // Confirmed Bookings list (dashboard panel for active session)
  const [confirmedBookings, setConfirmedBookings] = useState<{
    id: string;
    date: Date;
    slots: TimeSlot[];
    total: number;
  }[]>(() => {
    try {
      const stored = localStorage.getItem('margal_confirmed_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((b: any) => ({
          ...b,
          date: new Date(b.date)
        }));
      }
    } catch (e) {
      console.error('Error loading initial confirmed bookings', e);
    }
    return [];
  });

  // UI Selection State
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);

  // Admin Modification Modal State
  const [modifyingSlot, setModifyingSlot] = useState<TimeSlot | null>(null);
  const [showModModal, setShowModModal] = useState(false);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');
  const [editStatus, setEditStatus] = useState<SlotStatus>('booked');
  const [editNotes, setEditNotes] = useState('');

  // Calendar Helpers
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Helper: check if a specific slot is booked deterministically (for seeding)
  const getDeterministicBookedState = (date: Date, hour: number) => {
    const seed = date.getDate() + date.getMonth();
    return seed * hour % 7 === 0 || seed * hour % 5 === 0;
  };

  // Helper: Check if all slots on a date are booked
  const checkIfDayIsFull = (date: Date) => {
    const dateKey = getDateKey(date);
    if (bookings[dateKey]) {
      return bookings[dateKey].every(s => s.status === 'booked');
    }
    // Fallback to seeded initial state
    for (let h = 8; h <= 23; h++) {
      const isBooked = getDeterministicBookedState(date, h);
      if (!isBooked) return false;
    }
    return true;
  };

  // Generate initial slots for a date
  const generateSlotsForDate = (date: Date): TimeSlot[] => {
    const dateKey = getDateKey(date);
    const newSlots: TimeSlot[] = [];

    for (let i = 8; i <= 23; i++) {
      const isNight = i >= 18; // 6 PM onwards
      const rate = isNight ? NIGHT_RATE : DAY_RATE;
      
      const startAmPm = i >= 12 ? 'PM' : 'AM';
      const startHour12 = i > 12 ? i - 12 : i === 0 ? 12 : i;
      const endHour = i + 1;
      const endAmPm = endHour >= 12 && endHour < 24 ? 'PM' : 'AM';
      const endHour12 = endHour > 12 ? endHour - 12 : endHour === 24 ? 12 : endHour;
      const timeLabel = `${startHour12}:00 ${startAmPm} - ${endHour12}:00 ${endAmPm}`;

      const isBooked = getDeterministicBookedState(date, i);

      newSlots.push({
        id: `${dateKey}-${i}`,
        timeLabel,
        hour: i,
        rate,
        status: isBooked ? 'booked' : 'available',
        customerName: isBooked ? `Ka-Margal Player #${i}` : undefined,
        customerPhone: isBooked ? `0917-555-01${i}` : undefined,
        notes: isBooked ? 'Regular court booking reservation.' : undefined,
      });
    }

    return newSlots;
  };

  // Synchronize dynamic slot states for selected date
  const slots = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = getDateKey(selectedDate);
    if (!bookings[dateKey]) {
      // Lazy load deterministic state
      const initial = generateSlotsForDate(selectedDate);
      setBookings(prev => ({ ...prev, [dateKey]: initial }));
      return initial;
    }
    return bookings[dateKey];
  }, [selectedDate, bookings]);

  // Extract selected slots details
  const selectedSlotsData = useMemo(() => {
    return slots.filter((s) => selectedSlotIds.includes(s.id));
  }, [slots, selectedSlotIds]);

  const totalAmount = useMemo(() => {
    return selectedSlotsData.reduce((sum, slot) => sum + slot.rate, 0);
  }, [selectedSlotsData]);

  // Main Slot Click handler (completely flexible multi-select!)
  const handleSlotClick = (slotId: string) => {
    const slot = slots.find((s) => s.id === slotId);
    if (!slot) return;

    // Handle Admin override: open modification modal directly!
    if (isAdmin) {
      setModifyingSlot(slot);
      setEditCustomerName(slot.customerName || '');
      setEditCustomerPhone(slot.customerPhone || '');
      setEditStatus(slot.status);
      setEditNotes(slot.notes || '');
      setShowModModal(true);
      return;
    }

    // Customer constraints
    if (slot.status === 'booked') return;

    setSelectedSlotIds((prev) => {
      if (prev.includes(slotId)) {
        return prev.filter((id) => id !== slotId);
      } else {
        return [...prev, slotId].sort(
          (a, b) => parseInt(a.split('-')[3]) - parseInt(b.split('-')[3])
        );
      }
    });
  };

  // Save admin modification
  const handleAdminSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !modifyingSlot) return;

    const dateKey = getDateKey(selectedDate);
    const updatedSlots = bookings[dateKey].map((s) => {
      if (s.id === modifyingSlot.id) {
        return {
          ...s,
          status: editStatus,
          customerName: editStatus === 'booked' ? editCustomerName : undefined,
          customerPhone: editStatus === 'booked' ? editCustomerPhone : undefined,
          notes: editStatus === 'booked' ? editNotes : undefined,
        };
      }
      return s;
    });

    setBookings(prev => ({ ...prev, [dateKey]: updatedSlots }));
    
    // Clear selection if slot status changed from available/selected to booked
    if (editStatus === 'booked') {
      setSelectedSlotIds(prev => prev.filter(id => id !== modifyingSlot.id));
    }

    setShowModModal(false);
    setModifyingSlot(null);
    toast.success('Slot modification saved successfully!');
  };

  // Release booking completely
  const handleAdminRelease = () => {
    if (!selectedDate || !modifyingSlot) return;

    const dateKey = getDateKey(selectedDate);
    const updatedSlots = bookings[dateKey].map((s) => {
      if (s.id === modifyingSlot.id) {
        return {
          ...s,
          status: 'available' as SlotStatus,
          customerName: undefined,
          customerPhone: undefined,
          notes: undefined,
        };
      }
      return s;
    });

    setBookings(prev => ({ ...prev, [dateKey]: updatedSlots }));
    setSelectedSlotIds(prev => prev.filter(id => id !== modifyingSlot.id));
    setShowModModal(false);
    setModifyingSlot(null);
    toast.success('Slot unlocked and returned to Available!');
  };

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      
      // Update global database to set slots as booked for the customer
      if (selectedDate) {
        const dateKey = getDateKey(selectedDate);
        const updatedSlots = bookings[dateKey].map((s) => {
          if (selectedSlotIds.includes(s.id)) {
            return {
              ...s,
              status: 'booked' as SlotStatus,
              customerName: 'Online Customer',
              customerPhone: 'N/A',
              notes: 'Booked via Web Portal',
            };
          }
          return s;
        });
        setBookings(prev => ({ ...prev, [dateKey]: updatedSlots }));

        const newBooking = {
          id: `booking-${Date.now()}`,
          date: selectedDate.toISOString(),
          slots: selectedSlotsData,
          total: totalAmount
        };

        // Append to confirmed bookings panel
        setConfirmedBookings(prev => [
          {
            ...newBooking,
            date: selectedDate
          } as any,
          ...prev
        ]);

        // Persist to localStorage
        try {
          const stored = localStorage.getItem('margal_confirmed_bookings');
          const existing = stored ? JSON.parse(stored) : [];
          localStorage.setItem('margal_confirmed_bookings', JSON.stringify([newBooking, ...existing]));
        } catch (e) {
          console.error('Error saving confirmed booking to localStorage', e);
        }
      }

      toast.success('Booking Confirmed! See you on the court.');
      setSelectedSlotIds([]);
    }, 1500);
  };

  return (
    <div className="flex-grow bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-display font-bold uppercase tracking-wide text-slate-900 dark:text-white">
                Book a Court
              </h1>
              {isAdmin && (
                <span className="px-3 py-1 bg-pastel-blue/15 text-pastel-blue-dark dark:text-pastel-blue-light text-[10px] font-bold uppercase tracking-widest rounded-full border border-pastel-blue/30 flex items-center gap-1">
                  <Shield size={12} className="text-pastel-blue animate-pulse" />
                  Admin Override Active
                </span>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Select a date and time for your exclusive session.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Calendar & Slots */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Calendar Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                  <CalendarIcon className="text-pastel-blue" />
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dateVal = i + 1;
                  const targetDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    dateVal
                  );
                  const isToday =
                    new Date().getDate() === dateVal &&
                    new Date().getMonth() === currentDate.getMonth() &&
                    new Date().getFullYear() === currentDate.getFullYear();
                  const isSelected =
                    selectedDate?.getDate() === dateVal &&
                    selectedDate?.getMonth() === currentDate.getMonth() &&
                    selectedDate?.getFullYear() === currentDate.getFullYear();
                  const isPast = targetDate < new Date(new Date().setHours(0, 0, 0, 0));
                  
                  const isFull = checkIfDayIsFull(targetDate);

                  return (
                    <button
                      key={dateVal}
                      disabled={isPast}
                      onClick={() => setSelectedDate(targetDate)}
                      className={`
                        aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium relative transition-all cursor-pointer
                        ${isPast ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'hover:bg-pastel-blue/10 hover:text-pastel-blue dark:hover:text-pastel-blue-light'}
                        ${isSelected ? 'bg-pastel-blue text-white shadow-md hover:bg-pastel-blue hover:text-white dark:hover:text-white' : ''}
                        ${isToday && !isSelected ? 'border-2 border-pastel-blue text-pastel-blue' : ''}
                        ${isFull && !isPast && !isSelected ? 'bg-red-50/50 border border-pastel-coral/20 dark:bg-red-950/20' : ''}
                        ${!isPast && !isSelected && !isToday && (!isFull || isPast) ? 'text-slate-700 dark:text-slate-300' : ''}
                      `}
                    >
                      <span className={`${isFull && !isPast && !isSelected ? 'text-pastel-coral' : ''} font-bold`}>{dateVal}</span>
                      
                      {/* Fully Booked Text Badge */}
                      {isFull && !isPast && (
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider leading-none mt-1 ${isSelected ? 'text-white/80' : 'text-pastel-coral font-black animate-pulse'}`}>
                          FULL
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots Card */}
            <AnimatePresence mode="wait">
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                      <Clock className="text-pastel-coral" />
                      <span>Time Slots</span>
                    </h2>
                    
                    {/* Status Legend */}
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-white border border-slate-300 dark:bg-slate-800 dark:border-slate-600"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-pastel-blue"></div>
                        </div>
                        <span>Booked</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-pastel-blue"></div>
                        <span>Selected</span>
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="mb-4 bg-pastel-blue/10 text-pastel-blue-dark dark:text-pastel-blue-light text-xs font-medium px-4 py-3 rounded-xl flex items-center gap-2 border border-pastel-blue/20">
                      <Shield size={16} />
                      <span>Admin Mode overrides active: click any Booked slot to Modify, Unlock, or Edit Customer details.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {slots.map((slot) => {
                      const isSelected = selectedSlotIds.includes(slot.id);
                      const isBooked = slot.status === 'booked';
                      const isNight = slot.hour >= 18;

                      return (
                        <button
                          key={slot.id}
                          disabled={isBooked && !isAdmin}
                          onClick={() => handleSlotClick(slot.id)}
                          className={`
                            relative flex items-center justify-between p-4 rounded-xl border text-left transition-all group/btn
                            ${isBooked
                              ? isAdmin
                                ? 'bg-slate-100 border-pastel-blue-light/50 dark:bg-slate-800/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer hover:border-pastel-blue shadow-sm'
                                : 'bg-slate-50 border-slate-100 text-slate-400 dark:bg-slate-900/50 dark:border-slate-800/50 dark:text-slate-600 cursor-not-allowed'
                              : isSelected
                                ? 'bg-pastel-blue border-pastel-blue text-white shadow-md'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-pastel-blue hover:shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:border-pastel-blue-dark'
                            }
                          `}
                        >
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              <span>{slot.timeLabel}</span>
                              {isBooked && (
                                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
                                  Booked
                                </span>
                              )}
                            </div>
                            <div className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400 font-semibold'}`}>
                              {isNight ? 'Night Rate' : 'Day Rate'}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className={`font-display font-bold text-lg ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                              ₱{slot.rate}
                            </div>

                            {/* Booked Circle Dot Indicator */}
                            {isBooked && !isAdmin && (
                              <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center shrink-0">
                                <div className="w-2 h-2 rounded-full bg-pastel-blue"></div>
                              </div>
                            )}

                            {/* Selected Check Icon */}
                            {isSelected && (
                              <div className="bg-pastel-coral text-white rounded-full p-0.5 shadow-sm shrink-0">
                                <CheckCircle2 size={16} />
                              </div>
                            )}

                            {/* Admin Modification Quick-Icon */}
                            {isBooked && isAdmin && (
                              <div className="w-7 h-7 rounded-xl bg-pastel-blue/20 text-pastel-blue flex items-center justify-center shrink-0 group-hover/btn:scale-105 transition-transform">
                                <Edit3 size={14} />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Summary & Confirmed Bookings Panel */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Booking Summary Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-display font-semibold mb-6 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-4">
                Booking Summary
              </h2>

              {selectedSlotIds.length === 0 ? (
                <div className="text-center py-8 text-slate-500 flex flex-col items-center gap-3">
                  <Clock size={32} className="opacity-20 animate-pulse" />
                  <p>Select one or more time slots to book.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                      Date
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-2 font-semibold">
                      Selected Hours ({selectedSlotIds.length})
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {selectedSlotsData.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex justify-between text-sm items-center bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/50"
                        >
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">
                            {slot.timeLabel}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            ₱{slot.rate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-end mb-6">
                      <div className="text-slate-500 dark:text-slate-400 font-semibold">
                        Total Amount
                      </div>
                      <div className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                        ₱{totalAmount}
                      </div>
                    </div>

                    <div className="bg-pastel-blue/10 rounded-xl p-3 flex gap-3 items-start mb-6">
                      <AlertCircle
                        size={18}
                        className="text-pastel-blue shrink-0 mt-0.5"
                      />
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                        Payment is collected at the venue. Please arrive 15
                        minutes before your scheduled time.
                      </p>
                    </div>

                    <button
                      onClick={handleConfirm}
                      disabled={isConfirming}
                      className="w-full py-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer"
                    >
                      {isConfirming ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Confirming...</span>
                        </>
                      ) : (
                        'Confirm Booking'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* My Confirmed Bookings History Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-display font-semibold mb-4 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-pastel-blue shrink-0 animate-bounce" />
                <span>My Bookings ({confirmedBookings.length})</span>
              </h3>

              {confirmedBookings.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                  No confirmed bookings in this session yet.
                </div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {confirmedBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {b.date.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-pastel-coral dark:text-pastel-coral-light bg-pastel-coral/10 px-2 py-0.5 rounded-full tracking-wider">
                          Confirmed
                        </span>
                      </div>
                      
                      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 font-medium">
                        {b.slots.map(s => (
                          <div key={s.id} className="flex items-center gap-1.5">
                            <Clock size={12} className="shrink-0 text-slate-400" />
                            <span>{s.timeLabel}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-400">Total Price</span>
                        <span className="font-bold text-slate-950 dark:text-white">₱{b.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Admin Modification Modal Overlay */}
      <AnimatePresence>
        {showModModal && modifyingSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowModModal(false);
                setModifyingSlot(null);
              }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 border border-slate-100 dark:border-slate-800"
            >
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-pastel-blue font-display text-xl font-bold">
                  <Shield size={22} />
                  <h2>MODIFY BOOKING</h2>
                </div>
                <button
                  onClick={() => {
                    setShowModModal(false);
                    setModifyingSlot(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Selected Court Slot
                </div>
                <div className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Clock size={16} className="text-pastel-coral" />
                  <span>{modifyingSlot.timeLabel}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Rate: ₱{modifyingSlot.rate} / hour
                </div>
              </div>

              <form onSubmit={handleAdminSave} className="space-y-4">
                
                {/* Status selector */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Slot Status
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditStatus('available')}
                      className={`py-3 px-4 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${editStatus === 'available' ? 'bg-white border-pastel-blue text-pastel-blue-dark shadow-sm dark:bg-slate-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800 font-semibold'}`}
                    >
                      <Unlock size={14} /> Available
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStatus('booked')}
                      className={`py-3 px-4 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${editStatus === 'booked' ? 'bg-slate-900 border-slate-900 text-white shadow-sm dark:bg-slate-950 dark:border-slate-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800 font-semibold'}`}
                    >
                      <Lock size={14} /> Booked
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {editStatus === 'booked' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 overflow-hidden"
                    >
                      
                      {/* Customer Name */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Customer Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type="text"
                            required
                            value={editCustomerName}
                            onChange={(e) => setEditCustomerName(e.target.value)}
                            placeholder="Juan Dela Cruz"
                            className="w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent font-medium"
                          />
                        </div>
                      </div>

                      {/* Customer Phone */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type="tel"
                            required
                            value={editCustomerPhone}
                            onChange={(e) => setEditCustomerPhone(e.target.value)}
                            placeholder="0917-555-0123"
                            className="w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent font-medium"
                          />
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Booking Notes
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 text-slate-400" size={16} />
                          <textarea
                            rows={3}
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Add specific arrangements, tournament details, or requests..."
                            className="w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent resize-none font-medium"
                          />
                        </div>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer Buttons */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
                  
                  {modifyingSlot.status === 'booked' && (
                    <button
                      type="button"
                      onClick={handleAdminRelease}
                      className="w-full py-3 rounded-xl border border-pastel-coral text-pastel-coral hover:bg-pastel-coral/5 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                      <Trash2 size={16} /> Unlock Slot
                    </button>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md"
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}