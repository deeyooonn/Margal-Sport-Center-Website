'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function BookingActionButtons({ bookingId, refPrefix }: { bookingId: string; refPrefix?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'confirm' | 'reject' | null>(null)

  async function updateStatus(status: 'confirmed' | 'rejected') {
    setLoading(status === 'confirmed' ? 'confirm' : 'reject')
    await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(null)
    router.refresh()
  }

  const prefix = refPrefix ?? 'admin'

  return (
    <div className="flex gap-2">
      <button
        id={`${prefix}-confirm-${bookingId}`}
        onClick={() => updateStatus('confirmed')}
        disabled={loading !== null}
        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-50"
      >
        {loading === 'confirm' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm'}
      </button>
      <button
        id={`${prefix}-reject-${bookingId}`}
        onClick={() => updateStatus('rejected')}
        disabled={loading !== null}
        className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50"
      >
        {loading === 'reject' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Reject'}
      </button>
    </div>
  )
}
