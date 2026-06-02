'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleCancel() {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    setLoading(true)
    await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <Button
      variant="outline"
      size="sm"
      id={`cancel-booking-${bookingId}`}
      onClick={handleCancel}
      disabled={loading}
      className="text-xs border-border rounded-lg"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Cancel'}
    </Button>
  )
}
