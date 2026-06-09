import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ── Graceful degradation: if no credentials, supabase is null ────────────────
// The app still works in "demo mode" using localStorage.
// Add a .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable.

export const supabaseConfigured =
  Boolean(supabaseUrl) &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  Boolean(supabaseAnonKey) &&
  supabaseAnonKey !== 'your-anon-public-key-here';

export const supabase: SupabaseClient = supabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as SupabaseClient); // null-safe: never called when supabaseConfigured=false

if (!supabaseConfigured) {
  console.warn(
    '[Margal] Supabase not configured — running in localStorage demo mode.\n' +
    'To enable real auth & database, create .env.local with:\n' +
    '  VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=your-anon-key'
  );
}

// ─── Database Type Definitions ────────────────────────────────────────────────

export interface Profile {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  fb_link: string | null;
  avatar_url: string;
  role: 'user' | 'admin';
  tier: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  booking_date: string; // ISO date YYYY-MM-DD
  time_slots: TimeSlotData[];
  total_amount: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  customer_name: string | null;
  customer_phone: string | null;
  notes: string | null;
  created_at: string;
}

export interface TimeSlotData {
  id: string;
  timeLabel: string;
  hour: number;
  rate: number;
}
