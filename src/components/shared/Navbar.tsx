'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Activity, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/courts', label: 'Courts & Rates' },
  { href: '/events', label: 'Event Rentals' },
  { href: '/my-bookings', label: 'My Bookings' },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUser(user)
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (data?.role === 'admin' || data?.role === 'superadmin') {
          setIsAdmin(true)
        }
      }
      setLoading(false)
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <button
          id="mobile-menu-toggle"
          aria-label="Toggle menu"
          className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Logo */}
        <Link
          href="/"
          id="nav-logo"
          className="flex items-center gap-2.5 font-bold text-sm uppercase tracking-widest text-foreground hover:text-primary transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <span className="hidden sm:block">Margal <span className="text-muted-foreground font-normal">Sports Center</span></span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!loading && (
            user ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link href={isAdmin ? '/admin/dashboard' : '/my-bookings'} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {isAdmin ? 'Dashboard' : 'Profile'}
                </Link>
                <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-foreground transition-colors" title="Log Out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Log In
              </Link>
            )
          )}
          <Button
            id="nav-book-now"
            asChild
            size="sm"
            className="bg-transparent border border-foreground/30 text-foreground hover:bg-foreground hover:text-background rounded-full text-xs px-4 font-semibold uppercase tracking-wider transition-all"
          >
            <Link href="/book">Book Now</Link>
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-card border-t border-border px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border mt-2">
            {!loading && (
              user ? (
                <>
                  <Link
                    href={isAdmin ? '/admin/dashboard' : '/my-bookings'}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <User className="w-4 h-4" />
                    {isAdmin ? 'Admin Dashboard' : 'My Profile'}
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="flex w-full items-center gap-2 py-2.5 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  Log In
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  )
}
