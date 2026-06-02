import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // Refresh the session — required for Server Components to read auth state
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl
  const path = url.pathname

  const isAuthRoute = path === '/login' || path === '/register'
  const isAdminRoute = path.startsWith('/admin')
  const isUserRoute = path.startsWith('/my-bookings') || path.startsWith('/profile')

  // Redirect unauthenticated users away from protected routes
  if (!user && (isAdminRoute || isUserRoute)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is logged in
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role || 'customer'
    const isAdmin = role === 'admin' || role === 'superadmin'

    // If trying to access login/register while logged in
    if (isAuthRoute) {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      } else {
        return NextResponse.redirect(new URL('/my-bookings', request.url))
      }
    }

    // Redirect exact /admin to /admin/dashboard
    if (path === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // Redirect non-admins away from admin routes
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/my-bookings', request.url))
    }
  }

  return supabaseResponse
}

export const proxyConfig = {
  matcher: [
    '/my-bookings/:path*', 
    '/admin/:path*',
    '/login',
    '/register'
  ],
}
