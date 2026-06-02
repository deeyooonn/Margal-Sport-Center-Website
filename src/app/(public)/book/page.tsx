'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Court = { id: string; name: string; sport_type: string }
type Rate = { start_hour: number; end_hour: number; price_per_hour: number; label: string }
type BookedSlot = { start_time: string; end_time: string }

const TIME_SLOTS = [
  { label: '8:00 AM',  hour: 8 },
  { label: '9:00 AM',  hour: 9 },
  { label: '10:00 AM', hour: 10 },
  { label: '11:00 AM', hour: 11 },
  { label: '12:00 PM', hour: 12 },
  { label: '1:00 PM',  hour: 13 },
  { label: '2:00 PM',  hour: 14 },
  { label: '3:00 PM',  hour: 15 },
  { label: '4:00 PM',  hour: 16 },
  { label: '5:00 PM',  hour: 17 },
  { label: '6:00 PM',  hour: 18 },
  { label: '7:00 PM',  hour: 19 },
  { label: '8:00 PM',  hour: 20 },
  { label: '9:00 PM',  hour: 21 },
  { label: '10:00 PM', hour: 22 },
  { label: '11:00 PM', hour: 23 },
]

const SPORT_EMOJI: Record<string, string> = {
  badminton: '🏸',
  basketball: '🏀',
  futsal: '⚽',
  multi: '🏟️',
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}
function padTime(h: number) {
  return `${String(h).padStart(2, '0')}:00:00`
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function BookPage() {
  const supabase = createClient()
  const today = new Date()

  // Calendar state
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)

  // Courts state
  const [courts, setCourts] = useState<Court[]>([])
  const [courtsBySport, setCourtsBySport] = useState<Record<string, Court[]>>({})
  const [selectedSport, setSelectedSport] = useState<string>('')
  const [selectedCourt, setSelectedCourt] = useState<string>('')
  const [rates, setRates] = useState<Rate[]>([])
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Time selection
  const [selectedStart, setSelectedStart] = useState<number | null>(null)
  const [selectedEnd, setSelectedEnd] = useState<number | null>(null)

  // Form
  const [form, setForm] = useState({ name: '', email: '', phone: '', purpose: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successRef, setSuccessRef] = useState<string | null>(null)

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  // Load courts on mount
  useEffect(() => {
    async function loadCourts() {
      const { data } = await supabase.from('courts').select('id, name, sport_type').eq('is_active', true).order('sport_type').order('name')
      if (data) {
        setCourts(data)
        const grouped: Record<string, Court[]> = {}
        data.forEach(c => {
          if (!grouped[c.sport_type]) grouped[c.sport_type] = []
          grouped[c.sport_type].push(c)
        })
        setCourtsBySport(grouped)
        const firstSport = Object.keys(grouped)[0]
        if (firstSport) {
          setSelectedSport(firstSport)
          setSelectedCourt(grouped[firstSport][0].id)
        }
      }
    }
    loadCourts()
  }, [])

  // Load rates when court changes
  useEffect(() => {
    if (!selectedCourt) return
    async function loadRates() {
      const { data } = await supabase.from('rates').select('start_hour, end_hour, price_per_hour, label').eq('court_id', selectedCourt)
      setRates(data ?? [])
    }
    loadRates()
  }, [selectedCourt])

  // Load booked slots when court + date changes
  useEffect(() => {
    if (!selectedCourt || !selectedDate) return
    async function loadBookings() {
      setLoadingSlots(true)
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(selectedDate).padStart(2,'0')}`
      
      const [ { data: bookings }, { data: blocked } ] = await Promise.all([
        supabase
          .from('bookings')
          .select('start_time, end_time')
          .eq('court_id', selectedCourt)
          .eq('booking_date', dateStr)
          .not('status', 'in', '("rejected","cancelled")'),
        supabase
          .from('blocked_slots')
          .select('start_time, end_time')
          .or(`court_id.eq.${selectedCourt},court_id.is.null`)
          .eq('block_date', dateStr)
      ])
      
      setBookedSlots([...(bookings ?? []), ...(blocked ?? [])])
      setLoadingSlots(false)
    }
    loadBookings()
  }, [selectedCourt, selectedDate, viewMonth, viewYear])

  function isSlotBooked(hour: number): boolean {
    return bookedSlots.some(b => {
      const bStart = parseInt(b.start_time.split(':')[0])
      const bEnd = parseInt(b.end_time.split(':')[0])
      return hour >= bStart && hour < bEnd
    })
  }

  function getPriceForHour(hour: number): number {
    const rate = rates.find(r => hour >= r.start_hour && hour < r.end_hour)
    return rate?.price_per_hour ?? 0
  }

  function computeTotal(): number {
    if (selectedStart === null || selectedEnd === null || selectedEnd <= selectedStart) return 0
    let total = 0
    for (let h = selectedStart; h < selectedEnd; h++) {
      total += getPriceForHour(h)
    }
    return total
  }

  const total = computeTotal()
  const hours = selectedStart !== null && selectedEnd !== null && selectedEnd > selectedStart ? selectedEnd - selectedStart : 0
  const bookingDateStr = selectedDate ? `${MONTH_NAMES[viewMonth]} ${selectedDate}, ${viewYear}` : null
  const selectedCourtObj = courts.find(c => c.id === selectedCourt)

  async function handleSubmit() {
    if (!selectedDate || selectedStart === null || selectedEnd === null || !form.name || !form.phone || !form.email) return
    setSubmitting(true)
    setSubmitError(null)

    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(selectedDate).padStart(2,'0')}`

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: form.name,
        email: form.email,
        phone: form.phone,
        court_id: selectedCourt,
        booking_date: dateStr,
        start_time: padTime(selectedStart),
        end_time: padTime(selectedEnd),
        purpose: form.purpose || 'casual play',
        total_amount: total,
      }),
    })

    const json = await res.json()
    if (!res.ok) {
      if (json.details && Array.isArray(json.details)) {
        const issues = json.details.map((d: any) => `${d.path.join('.')}: ${d.message}`).join(', ')
        setSubmitError(`Invalid data: ${issues}`)
      } else {
        setSubmitError(json.error ?? 'Something went wrong. Please try again.')
      }
      setSubmitting(false)
      return
    }

    setSuccessRef(json.booking.reference_no)
    setSubmitting(false)
  }

  if (successRef) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Booking Submitted!</h1>
        <p className="text-muted-foreground mb-3">Your booking is pending admin confirmation.</p>
        <div className="glass-card rounded-2xl inline-block px-6 py-3 mb-8">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Reference Number</span>
          <div className="font-mono font-bold text-primary text-lg mt-1">{successRef}</div>
        </div>
        <div className="flex gap-3 justify-center">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2">
            <Link href="/my-bookings">View My Bookings <ArrowRight className="w-4 h-4" /></Link>
          </Button>
          <Button variant="outline" className="rounded-xl border-border" onClick={() => { setSuccessRef(null); setSelectedDate(null); setSelectedStart(null); setSelectedEnd(null); setForm({ name: '', email: '', phone: '', purpose: '' }) }}>
            Book Another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
          BOOK A <span className="gradient-text">COURT</span>
        </h1>
        <p className="text-muted-foreground">Select a date and time for your exclusive session.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Selectors + Calendar */}
        <div className="lg:col-span-2 space-y-5">

          {/* Sport selector */}
          {Object.keys(courtsBySport).length === 0 ? (
            <div className="glass-card rounded-2xl p-8 flex items-center justify-center gap-3 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading courts…
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Select Sport</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {Object.keys(courtsBySport).map(sport => (
                  <button
                    key={sport}
                    id={`sport-${sport}`}
                    onClick={() => { setSelectedSport(sport); setSelectedCourt(courtsBySport[sport][0].id); setSelectedStart(null); setSelectedEnd(null) }}
                    className={cn(
                      'rounded-xl p-3 text-left border transition-all text-sm',
                      selectedSport === sport
                        ? 'bg-primary/20 border-primary text-foreground'
                        : 'bg-secondary/50 border-border text-muted-foreground hover:border-primary/40'
                    )}
                  >
                    <div className="text-2xl mb-1">{SPORT_EMOJI[sport] ?? '🏟️'}</div>
                    <div className="font-semibold capitalize text-xs">{sport}</div>
                    <div className="text-[10px] opacity-60 mt-0.5">{courtsBySport[sport].length} court{courtsBySport[sport].length > 1 ? 's' : ''}</div>
                  </button>
                ))}
              </div>

              {selectedSport && courtsBySport[selectedSport]?.length > 1 && (
                <>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Select Court</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {courtsBySport[selectedSport].map(c => (
                      <button
                        key={c.id}
                        id={`court-select-${c.id}`}
                        onClick={() => { setSelectedCourt(c.id); setSelectedStart(null); setSelectedEnd(null) }}
                        className={cn(
                          'rounded-xl p-2.5 text-left border transition-all text-xs',
                          selectedCourt === c.id
                            ? 'bg-primary/20 border-primary text-foreground'
                            : 'bg-secondary/50 border-border text-muted-foreground hover:border-primary/40'
                        )}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Calendar */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="w-4 h-4 text-primary" />
                {MONTH_NAMES[viewMonth]} {viewYear}
              </div>
              <div className="flex gap-1">
                <button
                  id="cal-prev"
                  onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1) }}
                  className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="cal-next"
                  onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1) }}
                  className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center mb-2">
              {['SU','MO','TU','WE','TH','FR','SA'].map(d => (
                <div key={d} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
                const isPast = new Date(viewYear, viewMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                const isSelected = day === selectedDate

                return (
                  <button
                    key={day}
                    id={`cal-day-${day}`}
                    disabled={isPast}
                    onClick={() => { setSelectedDate(day); setSelectedStart(null); setSelectedEnd(null) }}
                    className={cn(
                      'aspect-square rounded-xl text-sm font-medium transition-all',
                      isPast && 'opacity-25 cursor-not-allowed',
                      !isPast && !isSelected && 'hover:bg-accent text-muted-foreground',
                      isToday && !isSelected && 'ring-1 ring-primary text-foreground',
                      isSelected && 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/30',
                    )}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>


        </div>

        {/* Right: Summary + Form */}
        <div className="space-y-5">
          <div className="glass-card rounded-2xl p-5 sticky top-20">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">Booking Summary</h2>

            {!selectedDate ? (
              <div className="text-center py-10 text-muted-foreground">
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a date to view available slots.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Time Selection inserted here */}
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    Select Time
                    {loadingSlots && <Loader2 className="w-3.5 h-3.5 animate-spin ml-1" />}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Start Time</Label>
                      <select
                        className="w-full bg-secondary/50 border border-border rounded-lg text-sm p-2.5 outline-none focus:border-primary/50 text-foreground"
                        value={selectedStart ?? ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value)
                          setSelectedStart(val)
                          
                          // Check if current selectedEnd is still valid
                          let needsReset = !selectedEnd || selectedEnd <= val
                          if (!needsReset && selectedEnd) {
                            for (let h = val; h < selectedEnd; h++) {
                              if (isSlotBooked(h)) needsReset = true
                            }
                          }
                          
                          if (needsReset) {
                            setSelectedEnd(val + 1)
                          }
                        }}
                      >
                        <option value="" disabled>Select start</option>
                        {TIME_SLOTS.map(({ label, hour }) => (
                          <option key={hour} value={hour} disabled={isSlotBooked(hour)}>
                            {label} {isSlotBooked(hour) ? '(Booked)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">End Time</Label>
                      <select
                        className="w-full bg-secondary/50 border border-border rounded-lg text-sm p-2.5 outline-none focus:border-primary/50 text-foreground"
                        value={selectedEnd ?? ''}
                        disabled={selectedStart === null}
                        onChange={(e) => setSelectedEnd(parseInt(e.target.value))}
                      >
                        <option value="" disabled>Select end</option>
                        {selectedStart !== null && Array.from({ length: 24 - selectedStart }).map((_, i) => {
                          const endHour = selectedStart + i + 1
                          let label = ''
                          if (endHour === 12) label = '12:00 PM'
                          else if (endHour === 24) label = '12:00 AM'
                          else if (endHour > 12) label = `${endHour - 12}:00 PM`
                          else label = `${endHour}:00 AM`

                          let hasBookingInBetween = false
                          for (let h = selectedStart; h < endHour; h++) {
                            if (isSlotBooked(h)) hasBookingInBetween = true
                          }

                          return (
                            <option key={endHour} value={endHour} disabled={hasBookingInBetween || endHour > 24}>
                              {label}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 border-t border-border pt-4">
                  {[
                    { label: 'Court', value: selectedCourtObj ? `${selectedCourtObj.name}` : '—' },
                    { label: 'Date', value: bookingDateStr },
                    { label: 'Duration', value: hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3 mt-3 flex justify-between">
                    <span className="font-bold text-sm">Total</span>
                    <span className="font-black text-lg text-primary">
                      {total > 0 ? `₱${total.toLocaleString()}` : '—'}
                    </span>
                  </div>
                </div>

                {hours > 0 && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    {submitError && (
                      <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {submitError}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="book-name" className="text-xs uppercase tracking-wider text-muted-foreground">Your Name</Label>
                      <Input id="book-name" placeholder="Juan Dela Cruz" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-secondary/50 border-border text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="book-phone" className="text-xs uppercase tracking-wider text-muted-foreground">Contact Number</Label>
                      <Input id="book-phone" placeholder="0912 345 6789" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="bg-secondary/50 border-border text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="book-email" className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                      <Input id="book-email" type="email" placeholder="player@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-secondary/50 border-border text-sm" />
                    </div>
                  </div>
                )}

                <Button
                  id="book-confirm"
                  disabled={!(hours > 0 && form.name && form.phone && form.email) || submitting}
                  onClick={handleSubmit}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold gap-2 disabled:opacity-40"
                >
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <>Confirm Booking <ArrowRight className="w-4 h-4" /></>}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
