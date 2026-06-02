'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

type Booking = {
  id: string
  reference_no: string
  customer_name: string
  email: string
  phone: string
  booking_date: string
  start_time: string
  end_time: string
  total_amount: number
  status: string
  admin_note: string | null
  courts: { name: string; sport_type: string } | null
}

const statusStyles: Record<string, string> = {
  confirmed: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  pending:   'text-amber-400 bg-amber-500/15 border-amber-500/30',
  rejected:  'text-red-400 bg-red-500/15 border-red-500/30',
  cancelled: 'text-muted-foreground bg-muted border-border',
}

const filters = ['All', 'Pending', 'Confirmed', 'Rejected', 'Cancelled']

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}
function formatTime(t: string) {
  const h = parseInt(t.split(':')[0])
  return `${h % 12 || 12}:00 ${h >= 12 ? 'PM' : 'AM'}`
}

export default function AdminBookingsClient({ bookings }: { bookings: Booking[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const filtered = bookings.filter(b => {
    const matchFilter = activeFilter === 'All' || b.status === activeFilter.toLowerCase()
    const q = search.toLowerCase()
    const matchSearch = b.customer_name.toLowerCase().includes(q) ||
      b.reference_no.toLowerCase().includes(q) ||
      (b.courts?.name ?? '').toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  async function updateStatus(id: string, status: 'confirmed' | 'rejected') {
    setLoadingId(`${id}-${status}`)
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoadingId(null)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight mb-1">Manage Bookings</h1>
        <p className="text-sm text-muted-foreground">Review, confirm, or reject booking requests</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="bookings-search"
            placeholder="Search bookings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-secondary/60 border-border text-sm h-10"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              id={`filter-${f.toLowerCase()}`}
              onClick={() => setActiveFilter(f)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                activeFilter === f
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary/50 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              )}
            >
              {f}
              {f !== 'All' && (
                <span className="ml-1.5 opacity-60">
                  ({bookings.filter(b => b.status === f.toLowerCase()).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Reference', 'Customer', 'Court', 'Date & Time', 'Amount', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground whitespace-nowrap">{b.reference_no}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="font-medium">{b.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{b.phone}</div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">{b.courts?.name ?? '—'}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div>{formatDate(b.booking_date)}</div>
                    <div className="text-xs text-muted-foreground">{formatTime(b.start_time)} – {formatTime(b.end_time)}</div>
                  </td>
                  <td className="px-5 py-4 font-bold whitespace-nowrap">₱{Number(b.total_amount).toLocaleString()}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={cn('inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border', statusStyles[b.status])}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {b.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          id={`confirm-${b.id}`}
                          onClick={() => updateStatus(b.id, 'confirmed')}
                          disabled={loadingId !== null}
                          className="text-xs font-semibold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                        >
                          {loadingId === `${b.id}-confirmed` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm'}
                        </button>
                        <button
                          id={`reject-${b.id}`}
                          onClick={() => updateStatus(b.id, 'rejected')}
                          disabled={loadingId !== null}
                          className="text-xs font-semibold text-red-400 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        >
                          {loadingId === `${b.id}-rejected` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Reject'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-14 text-muted-foreground text-sm">No bookings match your filters.</div>
          )}
        </div>
      </div>
    </div>
  )
}
