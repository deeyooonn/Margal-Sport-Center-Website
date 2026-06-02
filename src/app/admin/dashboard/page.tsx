import {
  BookOpen, CheckCircle, Clock, DollarSign, Calendar, TrendingUp, Users
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { BookingActionButtons } from './action-buttons'

const statusStyles: Record<string, string> = {
  confirmed: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  pending:   'text-amber-400 bg-amber-500/15 border-amber-500/30',
  rejected:  'text-red-400 bg-red-500/15 border-red-500/30',
  cancelled: 'text-muted-foreground bg-muted border-border',
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}
function formatTime(t: string) {
  const h = parseInt(t.split(':')[0])
  return `${h % 12 || 12}:00 ${h >= 12 ? 'PM' : 'AM'}`
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch stats in parallel
  const now = new Date()
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

  const [
    { count: totalBookings },
    { count: confirmedCount },
    { count: pendingCount },
    { data: revenueData },
    { data: recentBookings },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('bookings').select('total_amount').eq('status', 'confirmed').gte('booking_date', monthStart),
    supabase.from('bookings')
      .select(`id, reference_no, customer_name, booking_date, start_time, end_time, total_amount, status, courts(name)`)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const monthRevenue = (revenueData ?? []).reduce((sum, b) => sum + Number(b.total_amount), 0)

  const stats = [
    { label: 'Total Bookings', value: String(totalBookings ?? 0), icon: BookOpen, color: 'text-sky-400 bg-sky-500/15 border-sky-500/20' },
    { label: 'Confirmed', value: String(confirmedCount ?? 0), icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20' },
    { label: 'Pending Review', value: String(pendingCount ?? 0), icon: Clock, color: 'text-amber-400 bg-amber-500/15 border-amber-500/20' },
    { label: `Revenue (${now.toLocaleString('default', { month: 'short' })})`, value: `₱${monthRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-primary bg-primary/15 border-primary/20' },
  ]

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back, Admin. Here&apos;s today&apos;s overview.</p>
        </div>
        <Button id="admin-view-calendar" asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2 font-semibold">
          <Link href="/admin/calendar">
            <Calendar className="w-4 h-4" /> View Calendar
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass-card rounded-2xl p-5">
              <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center mb-4', stat.color)}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="text-2xl font-black mb-0.5">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Recent Bookings */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold text-sm uppercase tracking-wider">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-xs text-primary hover:text-primary/80 transition-colors font-semibold">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Reference', 'Customer', 'Court', 'Date & Time', 'Amount', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(recentBookings ?? []).map((b) => {
                const court = b.courts as { name: string } | null
                return (
                  <tr key={b.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground whitespace-nowrap">{b.reference_no}</td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap">{b.customer_name}</td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{court?.name ?? '—'}</td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      <div>{formatDate(b.booking_date)}</div>
                      <div className="text-xs opacity-70">{formatTime(b.start_time)} – {formatTime(b.end_time)}</div>
                    </td>
                    <td className="px-6 py-4 font-bold whitespace-nowrap">₱{Number(b.total_amount).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn('inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border', statusStyles[b.status])}>
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {b.status === 'pending' && (
                        <BookingActionButtons bookingId={b.id} refPrefix="dash" />
                      )}
                    </td>
                  </tr>
                )
              })}
              {(recentBookings ?? []).length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground text-sm">No bookings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: '/admin/bookings', label: 'Manage Bookings', icon: BookOpen },
          { href: '/admin/calendar', label: 'Court Schedule', icon: Calendar },
          { href: '/admin/courts', label: 'Manage Courts', icon: Users },
          { href: '/admin/reports', label: 'Export Reports', icon: TrendingUp },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            id={`admin-quick-${label.toLowerCase().replace(/\s/g, '-')}`}
            className="glass-card rounded-xl p-4 flex items-center gap-3 hover:border-primary/30 transition-all group"
          >
            <Icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
