import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { z } from 'zod'
import { cookies } from 'next/headers'

const BookingSchema = z.object({
  customer_name: z.string().min(2),
  email:         z.string().email(),
  phone:         z.string().min(10),
  court_id:      z.string(),
  booking_date:  z.string(),
  start_time:    z.string(),
  end_time:      z.string(),
  purpose:       z.string().optional(),
  total_amount:  z.number().positive(),
})

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = BookingSchema.parse(body)
    const supabase = await getSupabase()

    // Get logged-in user (optional — guest bookings allowed)
    const { data: { user } } = await supabase.auth.getUser()

    // Check for conflicts
    const { data: conflict, error: conflictError } = await supabase
      .from('bookings')
      .select('id')
      .eq('court_id', data.court_id)
      .eq('booking_date', data.booking_date)
      .lt('start_time', data.end_time)
      .gt('end_time', data.start_time)
      .not('status', 'in', '("rejected","cancelled")')
      .limit(1)

    const { data: blockedConflict, error: blockedError } = await supabase
      .from('blocked_slots')
      .select('id')
      .or(`court_id.eq.${data.court_id},court_id.is.null`)
      .eq('block_date', data.booking_date)
      .lt('start_time', data.end_time)
      .gt('end_time', data.start_time)
      .limit(1)

    if (conflictError || blockedError) {
      return NextResponse.json({ error: 'Database error checking conflicts.' }, { status: 500 })
    }

    if ((conflict && conflict.length > 0) || (blockedConflict && blockedConflict.length > 0)) {
      return NextResponse.json({ error: 'That time slot is already taken or blocked by admin. Please choose a different time.' }, { status: 409 })
    }

    // Generate reference number: MSC-YYYYMMDD-XXXX
    const ref = `MSC-${data.booking_date.replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        ...data,
        reference_no: ref,
        customer_id: user?.id ?? null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Insert a pending payment record
    await supabase.from('payments').insert({
      booking_id: booking.id,
      amount: data.total_amount,
      status: 'pending',
    })

    return NextResponse.json({ booking })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
