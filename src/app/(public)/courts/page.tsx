import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Clock } from 'lucide-react'

const courts = [
  {
    id: '1',
    name: 'Court A — Badminton',
    sport: 'badminton',
    badge: 'Badminton',
    badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    emoji: '🏸',
    description: 'Professional-grade badminton court with high ceilings, anti-slip flooring, and proper lighting.',
    rates: [
      { label: 'Off-Peak (Mon–Fri, 8AM–4PM)', price: 80 },
      { label: 'Peak Hours (Mon–Fri, 4PM–12MN)', price: 120 },
      { label: 'Weekend / Holiday', price: 150 },
    ],
  },
  {
    id: '2',
    name: 'Court B — Basketball',
    sport: 'basketball',
    badge: 'Basketball',
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    emoji: '🏀',
    description: 'Full-size regulation basketball court with hardwood flooring, scoreboards, and PA system.',
    rates: [
      { label: 'Off-Peak (Mon–Fri, 8AM–4PM)', price: 500 },
      { label: 'Peak Hours (Mon–Fri, 4PM–12MN)', price: 800 },
      { label: 'Weekend / Holiday', price: 1000 },
    ],
  },
  {
    id: '3',
    name: 'Court C — Futsal',
    sport: 'futsal',
    badge: 'Futsal',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    emoji: '⚽',
    description: 'Certified futsal court with synthetic turf, goal posts, and ample space for competitive play.',
    rates: [
      { label: 'Off-Peak (Mon–Fri, 8AM–4PM)', price: 400 },
      { label: 'Peak Hours (Mon–Fri, 4PM–12MN)', price: 600 },
      { label: 'Weekend / Holiday', price: 800 },
    ],
  },
  {
    id: '4',
    name: 'Multi-purpose Venue',
    sport: 'multi',
    badge: 'Multi-Sport',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    emoji: '🏟️',
    description: 'Versatile indoor venue configurable for multiple sports, events, and private gatherings.',
    rates: [
      { label: 'Half-Day (up to 6 hours)', price: 2000 },
      { label: 'Full-Day (up to 12 hours)', price: 3800 },
    ],
  },
]

export default function CourtsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-3">
          Courts & <span className="gradient-text">Rates</span>
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl">
          Browse our available courts and pricing. All courts are fully covered with proper ventilation and lighting.
        </p>
      </div>

      {/* Courts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courts.map((court) => (
          <div
            key={court.id}
            className="glass-card rounded-2xl p-6 flex flex-col gap-5 hover:border-primary/30 transition-all duration-300 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{court.emoji}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${court.badgeColor}`}>
                      {court.badge}
                    </span>
                  </div>
                  <h2 className="font-bold text-base">{court.name}</h2>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">{court.description}</p>

            {/* Rates */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                <Clock className="w-3.5 h-3.5" />
                Pricing
              </div>
              {court.rates.map((rate) => (
                <div
                  key={rate.label}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-secondary/60 border border-border/50"
                >
                  <span className="text-sm text-muted-foreground">{rate.label}</span>
                  <span className="text-sm font-bold text-foreground">
                    ₱{rate.price.toLocaleString()}
                    <span className="text-xs font-normal text-muted-foreground">/hr</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Action */}
            <Button
              asChild
              id={`book-court-${court.id}`}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2 font-semibold"
            >
              <Link href={`/book?court=${court.id}`}>
                Book This Court <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        ))}
      </div>

      {/* Event Rental CTA */}
      <div className="mt-10 rounded-2xl border border-border bg-gradient-to-r from-primary/10 via-transparent to-transparent p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Need the whole venue for an event?</h3>
          <p className="text-sm text-muted-foreground">
            We offer exclusive full-facility packages for tournaments, sports fests, and private parties.
          </p>
        </div>
        <Button
          id="courts-event-rental-cta"
          asChild
          variant="outline"
          className="shrink-0 border-border hover:bg-accent rounded-xl"
        >
          <Link href="/events">View Event Packages</Link>
        </Button>
      </div>
    </div>
  )
}
