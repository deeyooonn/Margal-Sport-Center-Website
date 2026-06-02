import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Shield, Calendar, Trophy, Clock, MapPin } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Instant Booking',
    description: 'Book your court online in seconds. No calls, no waiting.',
  },
  {
    icon: Shield,
    title: 'Guaranteed Slots',
    description: 'Your booking is locked in. No surprises, no double-booking.',
  },
  {
    icon: Calendar,
    title: 'Real-time Availability',
    description: 'See open time slots live and pick what works for you.',
  },
]

const courts = [
  { name: 'Badminton', emoji: '🏸', slots: '8 courts', color: 'from-sky-500/20 to-blue-600/10' },
  { name: 'Basketball', emoji: '🏀', slots: '2 full courts', color: 'from-orange-500/20 to-red-600/10' },
  { name: 'Futsal', emoji: '⚽', slots: '1 court', color: 'from-green-500/20 to-emerald-600/10' },
  { name: 'Multi-purpose', emoji: '🏟️', slots: 'Indoor venue', color: 'from-purple-500/20 to-violet-600/10' },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/8 blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-sky-500/5 blur-[100px]" />
        </div>

        {/* Badge */}
        <div className="relative mb-6 inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Now Open 8AM – 12MN Daily
        </div>

        {/* Heading */}
        <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.9]">
          BOOK A{' '}
          <span className="gradient-text">COURT</span>
          <br />
          IN SECONDS
        </h1>

        <p className="relative text-base md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
          Premium covered courts in Bustos, Bulacan. Badminton, Basketball, Futsal & more — reserved just for you.
        </p>

        <div className="relative flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            id="hero-book-now"
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold px-8 gap-2 text-base h-12"
          >
            <Link href="/book">
              Book Now <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            id="hero-view-courts"
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-border text-muted-foreground hover:text-foreground hover:bg-accent text-base h-12 px-8"
          >
            <Link href="/courts">View Courts & Rates</Link>
          </Button>
        </div>

        {/* Info chips */}
        <div className="relative mt-14 flex flex-wrap gap-3 justify-center">
          {[
            { icon: MapPin, text: 'Brgy. Cambaog, Bustos, Bulacan' },
            { icon: Clock, text: 'Open 8:00 AM – 12:00 MN' },
            { icon: Trophy, text: 'Event Rentals Available' },
          ].map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-2 bg-secondary/60 border border-border text-muted-foreground text-xs px-3.5 py-1.5 rounded-full"
            >
              <Icon className="w-3.5 h-3.5 text-primary" />
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* Courts */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-3">
              Our <span className="gradient-text">Facilities</span>
            </h2>
            <p className="text-muted-foreground text-base">World-class indoor courts for every sport you love</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {courts.map((court) => (
              <Link
                key={court.name}
                href="/courts"
                className={`group relative rounded-2xl bg-gradient-to-br ${court.color} border border-border p-6 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5`}
              >
                <div className="text-4xl mb-4">{court.emoji}</div>
                <h3 className="font-bold text-sm mb-1">{court.name}</h3>
                <p className="text-xs text-muted-foreground">{court.slots}</p>
                <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-card/50 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-3">
              Why <span className="gradient-text">Choose Us</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon
              return (
                <div key={feat.title} className="glass-card rounded-2xl p-6">
                  <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
            READY TO <span className="gradient-text">PLAY?</span>
          </h2>
          <p className="text-muted-foreground mb-8 text-base">
            Reserve your court today and experience the best sports facility in Bulacan.
          </p>
          <Button
            id="cta-book-now"
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold px-10 h-12 text-base gap-2"
          >
            <Link href="/book">
              Book Your Court <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
