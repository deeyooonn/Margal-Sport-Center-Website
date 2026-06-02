'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type CalendarBooking = {
  id: string
  booking_date: string
  start_time: string
  end_time: string
  customer_name: string
  status: string
  courts: { id: string; name: string; sport_type: string } | null
}

type Court = {
  id: string
  name: string
  sport_type: string
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

const SPORT_COLORS: Record<string, string> = {
  badminton:  'bg-sky-500/30 text-sky-300 border-sky-500/40',
  basketball: 'bg-orange-500/30 text-orange-300 border-orange-500/40',
  futsal:     'bg-emerald-500/30 text-emerald-300 border-emerald-500/40',
  multi:      'bg-purple-500/30 text-purple-300 border-purple-500/40',
}

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function getFirstDay(y: number, m: number) { return new Date(y, m, 1).getDay() }
function formatTime(t: string) {
  const h = parseInt(t.split(':')[0])
  return `${h % 12 || 12}${h >= 12 ? 'p' : 'a'}`
}

export default function AdminCalendarClient({ bookings, courts }: { bookings: CalendarBooking[], courts: Court[] }) {
  const router = useRouter()
  const supabase = createClient()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<{ dateKey: string; events: CalendarBooking[] } | null>(null)

  // Block Slot Modal State
  const [isBlocking, setIsBlocking] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [blockForm, setBlockForm] = useState({
    date: '',
    start_time: 8,
    end_time: 9,
    court_id: '',
    reason: ''
  })

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDay(year, month)

  const prevMonth = () => month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1)
  const nextMonth = () => month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1)

  // Build a map of dateKey → bookings
  const eventMap: Record<string, CalendarBooking[]> = {}
  bookings.forEach(b => {
    if (!eventMap[b.booking_date]) eventMap[b.booking_date] = []
    eventMap[b.booking_date].push(b)
  })

  // Unique sport types for legend
  const sports = [...new Set(bookings.map(b => b.courts?.sport_type).filter(Boolean))] as string[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight mb-1">Court Schedule</h1>
          <p className="text-sm text-muted-foreground">View and manage all court reservations</p>
        </div>
        <Button 
          id="admin-block-slot" 
          size="sm" 
          onClick={() => setIsBlocking(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2 font-semibold"
        >
          <Plus className="w-4 h-4" /> Block Slot
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(SPORT_COLORS).filter(([s]) => sports.includes(s)).map(([sport, color]) => (
          <div key={sport} className="flex items-center gap-2 text-xs text-muted-foreground capitalize">
            <span className={cn('w-3 h-3 rounded border', color)} />
            {sport}
          </div>
        ))}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-3 h-3 rounded border bg-amber-500/30 border-amber-500/40" />
          Pending
        </div>
      </div>

      {/* Calendar */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold">{MONTH_NAMES[month]} {year}</h2>
          <div className="flex gap-1">
            <button id="cal-prev" onClick={prevMonth} className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent flex items-center justify-center transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button id="cal-next" onClick={nextMonth} className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="py-2.5 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 auto-rows-[minmax(80px,_1fr)]">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} className="border-r border-b border-border/50 bg-muted/20" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const events = eventMap[dateKey] ?? []
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            const col = (firstDay + i) % 7

            return (
              <div
                key={day}
                onClick={() => setSelectedDay({ dateKey, events })}
                className={cn(
                  'border-r border-b border-border/50 p-1.5 flex flex-col gap-1 min-h-[100px] cursor-pointer hover:bg-muted/30 transition-colors',
                  col === 6 && 'border-r-0',
                  isToday && 'bg-primary/5 hover:bg-primary/10'
                )}
              >
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold self-start',
                  isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                )}>
                  {day}
                </div>
                {events.slice(0, 2).map((evt, ei) => {
                  const sport = evt.courts?.sport_type ?? 'multi'
                  const colorClass = evt.status === 'pending'
                    ? 'bg-amber-500/30 text-amber-300 border-amber-500/40'
                    : (SPORT_COLORS[sport] ?? SPORT_COLORS.multi)
                  return (
                    <div
                      key={ei}
                      title={`${evt.courts?.name} · ${evt.customer_name} · ${formatTime(evt.start_time)}–${formatTime(evt.end_time)}`}
                      className={cn('text-[10px] rounded px-1.5 py-0.5 border font-medium truncate cursor-default', colorClass)}
                    >
                      {evt.courts?.name?.split(' ').slice(-1)[0]} · {formatTime(evt.start_time)}–{formatTime(evt.end_time)}
                    </div>
                  )
                })}
                {events.length > 2 && (
                  <div className="text-[9px] text-muted-foreground px-1">+{events.length - 2} more</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <Dialog open={!!selectedDay} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">
              {selectedDay && new Date(selectedDay.dateKey + 'T00:00:00').toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {selectedDay?.events.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">
                No bookings for this date.
              </div>
            ) : (
              selectedDay?.events.map((evt) => {
                const sport = evt.courts?.sport_type ?? 'multi'
                const isBlocked = evt.status === 'blocked'
                const colorClass = evt.status === 'pending'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  : isBlocked 
                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                    : (SPORT_COLORS[sport]?.replace('/30', '/10').replace('text-', 'text-').replace('border-', 'border-') ?? 'bg-muted border-border text-foreground')
                
                return (
                  <div key={evt.id} className={cn("flex flex-col gap-1.5 p-3 rounded-xl border", colorClass)}>
                    <div className="flex items-start justify-between">
                      <div className="font-bold text-sm">{formatTime(evt.start_time)} – {formatTime(evt.end_time)}</div>
                      <div className="text-xs uppercase tracking-wider font-bold opacity-80">{evt.courts?.name || 'All Courts'}</div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-sm font-medium">{evt.customer_name}</div>
                        <div className="text-xs opacity-70 mt-0.5 capitalize">{isBlocked ? 'Blocked Slot' : evt.status}</div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Block Slot Dialog */}
      <Dialog open={isBlocking} onOpenChange={setIsBlocking}>
        <DialogContent className="max-w-md bg-background border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">Block a Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Date</label>
              <input 
                type="date" 
                value={blockForm.date}
                onChange={e => setBlockForm(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-secondary/50 border border-border rounded-lg text-sm p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Start Time</label>
                <select 
                  value={blockForm.start_time}
                  onChange={e => setBlockForm(f => ({ ...f, start_time: parseInt(e.target.value) }))}
                  className="w-full bg-secondary/50 border border-border rounded-lg text-sm p-2.5 outline-none focus:border-primary/50 text-foreground"
                >
                  {Array.from({length: 16}).map((_, i) => (
                    <option key={i+8} value={i+8}>{i+8 > 12 ? (i+8)-12 + ' PM' : i+8 === 12 ? '12 PM' : i+8 + ' AM'}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">End Time</label>
                <select 
                  value={blockForm.end_time}
                  onChange={e => setBlockForm(f => ({ ...f, end_time: parseInt(e.target.value) }))}
                  className="w-full bg-secondary/50 border border-border rounded-lg text-sm p-2.5 outline-none focus:border-primary/50 text-foreground"
                >
                  {Array.from({length: 24 - blockForm.start_time}).map((_, i) => {
                    const h = blockForm.start_time + i + 1
                    return <option key={h} value={h}>{h > 12 && h < 24 ? h-12 + ' PM' : h === 12 ? '12 PM' : h === 24 ? '12 AM' : h + ' AM'}</option>
                  })}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Court</label>
              <select 
                value={blockForm.court_id}
                onChange={e => setBlockForm(f => ({ ...f, court_id: e.target.value }))}
                className="w-full bg-secondary/50 border border-border rounded-lg text-sm p-2.5 outline-none focus:border-primary/50 text-foreground"
              >
                <option value="">All Courts</option>
                {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Reason</label>
              <input 
                type="text" 
                placeholder="e.g. Maintenance"
                value={blockForm.reason}
                onChange={e => setBlockForm(f => ({ ...f, reason: e.target.value }))}
                className="w-full bg-secondary/50 border border-border rounded-lg text-sm p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>

            <Button 
              disabled={!blockForm.date || submitting}
              onClick={async () => {
                setSubmitting(true)
                const { data: { user } } = await supabase.auth.getUser()
                await supabase.from('blocked_slots').insert({
                  block_date: blockForm.date,
                  start_time: `${String(blockForm.start_time).padStart(2,'0')}:00:00`,
                  end_time: `${String(blockForm.end_time).padStart(2,'0')}:00:00`,
                  court_id: blockForm.court_id || null,
                  reason: blockForm.reason || 'Admin Block',
                  created_by: user?.id
                })
                setSubmitting(false)
                setIsBlocking(false)
                router.refresh()
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold"
            >
              {submitting ? 'Blocking...' : 'Confirm Block'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
