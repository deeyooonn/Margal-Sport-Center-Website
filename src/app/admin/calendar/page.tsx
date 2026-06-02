import { createClient } from '@/lib/supabase/server'
import AdminCalendarClient from './calendar-client'

export default async function AdminCalendarPage() {
  const supabase = await createClient()

  // Fetch all non-cancelled/rejected bookings with court info
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id, booking_date, start_time, end_time, customer_name, status,
      courts ( id, name, sport_type )
    `)
    .not('status', 'in', '("rejected","cancelled")')
    .order('booking_date')
  // Fetch all blocked slots
  const { data: blocked } = await supabase
    .from('blocked_slots')
    .select(`
      id, block_date, start_time, end_time, reason,
      courts ( id, name, sport_type )
    `)

  const combined = [
    ...(bookings ?? []),
    ...(blocked ?? []).map(b => ({
      id: b.id,
      booking_date: b.block_date,
      start_time: b.start_time,
      end_time: b.end_time,
      customer_name: b.reason || 'Blocked',
      status: 'blocked',
      courts: b.courts
    }))
  ]

  // Sort by date and time
  combined.sort((a, b) => {
    if (a.booking_date !== b.booking_date) return a.booking_date.localeCompare(b.booking_date)
    return a.start_time.localeCompare(b.start_time)
  })

  // Fetch active courts for the block modal
  const { data: courts } = await supabase.from('courts').select('id, name, sport_type').eq('is_active', true)

  return <AdminCalendarClient bookings={combined} courts={courts ?? []} />
}
