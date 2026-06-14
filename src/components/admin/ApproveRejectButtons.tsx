'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ApproveRejectButtons({ propertyId, title }: { propertyId: string; title: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [rejectMode, setRejectMode] = useState(false)
  const [reason, setReason] = useState('')

  async function call(action: 'approve' | 'reject') {
    setLoading(action)
    await fetch('/api/properties/approve', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, action, reason }),
    })
    setLoading(null); router.refresh()
  }

  if (rejectMode) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <textarea placeholder="Rejection reason..." value={reason} onChange={e => setReason(e.target.value)} rows={2}
        style={{ background: 'var(--gray-2)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: 'var(--white)', padding: '6px 10px', fontSize: '0.78rem', resize: 'vertical', fontFamily: 'inherit', width: 200 }} />
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="btn-ghost btn-xs" disabled={loading === 'reject'} onClick={() => call('reject')}>Confirm</button>
        <button className="btn-ghost btn-xs" onClick={() => setRejectMode(false)}>Cancel</button>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button className="btn-primary btn-xs" disabled={!!loading} onClick={() => call('approve')}>{loading === 'approve' ? '...' : 'Approve'}</button>
      <button className="btn-ghost btn-xs" disabled={!!loading} onClick={() => setRejectMode(true)}>Reject</button>
    </div>
  )
}
