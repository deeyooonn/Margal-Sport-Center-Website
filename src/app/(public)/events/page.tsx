'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, Users, Calendar, ArrowRight, CheckCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const packages = [
  {
    id: 'half-day',
    name: 'Half-Day Package',
    tagline: 'Perfect for quick leagues',
    hours: '6 Hours',
    price: 2000,
    color: 'border-border',
    features: ['Exclusive court access', 'Scoreboard & PA system included', 'Dedicated staff assistance'],
  },
  {
    id: 'full-day',
    name: 'Full-Day Package',
    tagline: 'For major tournaments',
    hours: '12 Hours',
    price: 3800,
    color: 'border-primary/50',
    featured: true,
    features: ['All Half-Day inclusions', 'Free use of holding area', 'Flexible setup time'],
  },
]

const eventTypes = [
  { id: 'tournament', label: 'Tournament', icon: Trophy },
  { id: 'birthday', label: 'Birthday/Party', icon: '🎉' as any },
  { id: 'corporate', label: 'Corporate Event', icon: Users },
]

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [form, setForm] = useState({ date: '', guests: '', name: '', phone: '', notes: '' })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
          RENT FOR <span className="gradient-text">EVENTS</span>
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
          Need the whole court for a tournament, sports fest, or private party?
          We offer flexible packages for exclusive full-facility use.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Packages */}
        <div className="space-y-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">EVENT PACKAGES</h2>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={cn(
                'glass-card rounded-2xl p-6 border transition-all',
                pkg.featured ? 'border-primary/40' : 'border-border'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-base mb-0.5">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground">{pkg.tagline}</p>
                </div>
                <span className={cn(
                  'text-xs font-bold px-3 py-1 rounded-full',
                  pkg.featured ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                )}>
                  {pkg.hours}
                </span>
              </div>
              <ul className="space-y-1.5 mb-4">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="text-2xl font-black">
                ₱{pkg.price.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground ml-1">starting</span>
              </div>
            </div>
          ))}

          <div className="glass-card rounded-2xl p-6 border border-dashed border-border">
            <h3 className="font-bold mb-2">Custom Requirements?</h3>
            <p className="text-sm text-muted-foreground">
              Need specific arrangements, catering space, or multi-day booking? Fill out the form and we&apos;ll tailor a package for you.
            </p>
          </div>
        </div>

        {/* Right: Inquiry Form */}
        <div className="glass-card rounded-2xl p-7 space-y-6 self-start sticky top-20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">EVENT INQUIRY FORM</h2>

          {/* Event type */}
          <div>
            <p className="text-sm font-medium mb-3">Event Type</p>
            <div className="grid grid-cols-3 gap-2">
              {eventTypes.map((t) => {
                const Icon = typeof t.icon !== 'string' ? t.icon : null
                return (
                  <button
                    key={t.id}
                    id={`event-type-${t.id}`}
                    onClick={() => setSelectedType(t.id)}
                    className={cn(
                      'rounded-xl p-4 flex flex-col items-center gap-2 border text-xs font-medium transition-all',
                      selectedType === t.id
                        ? 'bg-primary/20 border-primary text-foreground'
                        : 'bg-secondary/50 border-border text-muted-foreground hover:border-primary/40'
                    )}
                  >
                    {Icon ? <Icon className="w-5 h-5 text-primary" /> : <span className="text-2xl">{t.icon}</span>}
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-date" className="text-xs uppercase tracking-wider text-muted-foreground">Target Date</Label>
              <Input
                id="event-date"
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="bg-secondary/60 border-border text-sm h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-guests" className="text-xs uppercase tracking-wider text-muted-foreground">Estimated Guests</Label>
              <Input
                id="event-guests"
                placeholder="e.g. 50"
                value={form.guests}
                onChange={e => setForm(f => ({ ...f, guests: e.target.value }))}
                className="bg-secondary/60 border-border text-sm h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-name" className="text-xs uppercase tracking-wider text-muted-foreground">Your Name</Label>
              <Input
                id="event-name"
                placeholder="Juan Dela Cruz"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="bg-secondary/60 border-border text-sm h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-phone" className="text-xs uppercase tracking-wider text-muted-foreground">Contact Number</Label>
              <Input
                id="event-phone"
                placeholder="0912 345 6789"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="bg-secondary/60 border-border text-sm h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-notes" className="text-xs uppercase tracking-wider text-muted-foreground">Additional Details</Label>
            <Textarea
              id="event-notes"
              placeholder="Tell us more about your event (e.g., need catering space, specific hours...)"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={4}
              className="bg-secondary/60 border-border text-sm resize-none"
            />
          </div>

          <Button
            id="event-submit"
            className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-xl font-bold h-12 gap-2 uppercase tracking-wider text-xs"
          >
            Send Inquiry <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
