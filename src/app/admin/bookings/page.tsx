import { createClient } from '@/lib/supabase/server'
import AdminBookingsClient from './bookings-client'

export default async function AdminBookingsPage() {
  const supabase = await createClient()

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id, reference_no, customer_name, email, phone,
      booking_date, start_time, end_time, total_amount, status, admin_note,
      courts ( name, sport_type )
    `)
    .order('created_at', { ascending: false })

  return <AdminBookingsClient bookings={bookings ?? []} />
}
