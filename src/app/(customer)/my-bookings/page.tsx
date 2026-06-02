import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { CancelBookingButton } from './cancel-button'

const statusMap = {
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  pending:   { label: 'Pending',   icon: AlertCircle, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  rejected:  { label: 'Rejected',  icon: XCircle,     color: 'text-red-400 bg-red-500/15 border-red-500/30' },
  cancelled: { label: 'Cancelled', icon: XCircle,     color: 'text-muted-foreground bg-muted border-border' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })
}

function formatTime(timeStr: string) {
  const [h] = timeStr.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:00 ${period}`
}

export default async function MyBookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/my-bookings')
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id, reference_no, booking_date, start_time, end_time,
      total_amount, status, purpose,
      courts ( name, sport_type )
    `)
    .eq('customer_id', user.id)
    .order('booking_date', { ascending: false })
    .order('start_time', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">
            My <span className="gradient-text">Bookings</span>
          </h1>
          <p className="text-muted-foreground text-sm">Your past and upcoming reservations</p>
        </div>
        <Button
          id="new-booking-btn"
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold gap-2"
        >
          <Link href="/book">
            New Booking <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {(bookings ?? []).map((b) => {
          const court = b.courts as { name: string; sport_type: string } | null
          const status = statusMap[b.status as keyof typeof statusMap] ?? statusMap.pending
          const StatusIcon = status.icon
          const hours = (parseInt(b.end_time) - parseInt(b.start_time))
          const durationHours = (() => {
            const [sh] = b.start_time.split(':').map(Number)
            const [eh] = b.end_time.split(':').map(Number)
            return eh - sh
          })()

          return (
            <div
              key={b.id}
              className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5 hover:border-primary/20 transition-all"
            >
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-bold">{court?.name ?? 'Unknown Court'}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{b.reference_no}</p>
                  </div>
                  <span className={cn(
                    'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border',
                    status.color
                  )}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />{formatDate(b.booking_date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {formatTime(b.start_time)} – {formatTime(b.end_time)}
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 sm:gap-2 shrink-0">
                <div className="text-right">
                  <div className="text-xl font-black">₱{Number(b.total_amount).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{durationHours} hour{durationHours !== 1 ? 's' : ''}</div>
                </div>
                {b.status === 'pending' && (
                  <CancelBookingButton bookingId={b.id} />
                )}
              </div>
            </div>
          )
        })}

        {(bookings ?? []).length === 0 && (
          <div className="glass-card rounded-2xl p-16 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground mb-4">No bookings yet</p>
            <Button asChild className="bg-primary text-primary-foreground rounded-xl gap-2">
              <Link href="/book">Book Your First Court <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
