'use client'
import { useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase/browser'

export default function ServiceBookingForm({ serviceType, userId, serviceTitle }: { serviceType: string; userId: string; serviceTitle: string }) {
  const [form, setForm] = useState({ title:'', city:'', location:'', budget_min:'', budget_max:'', description:'' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = getSupabaseBrowser()
    const { error } = await supabase.from('service_requests').insert({
      buyer_id: userId,
      service_type: serviceType as any,
      title: form.title || serviceTitle,
      description: form.description || null,
      location: form.location,
      city: form.city,
      budget_min: form.budget_min ? parseInt(form.budget_min) : null,
      budget_max: form.budget_max ? parseInt(form.budget_max) : null,
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSent(true)
  }

  if (sent) return (
    <div className="auth-message success" style={{ padding:24, textAlign:'center' }}>
      ✓ Request submitted! Our team will contact you within 24 hours.
    </div>
  )

  return (
    <form onSubmit={onSubmit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ fontWeight:600, fontSize:'0.9rem', marginBottom:4 }}>Book {serviceTitle}</div>
      <div className="form-group">
        <label className="form-label">City *</label>
        <input required className="form-input" placeholder="Varanasi" value={form.city} onChange={e => set('city', e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Full Address *</label>
        <input required className="form-input" placeholder="Colony, landmark..." value={form.location} onChange={e => set('location', e.target.value)} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        <div className="form-group">
          <label className="form-label">Min Budget (₹)</label>
          <input type="number" className="form-input" placeholder="100000" value={form.budget_min} onChange={e => set('budget_min', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Max Budget (₹)</label>
          <input type="number" className="form-input" placeholder="500000" value={form.budget_max} onChange={e => set('budget_max', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Details</label>
        <textarea className="form-input" rows={3} placeholder="Describe your requirements..." value={form.description} onChange={e => set('description', e.target.value)} style={{ resize:'vertical' }} />
      </div>
      {error && <div className="auth-message error">{error}</div>}
      <button type="submit" className="btn-primary" style={{ justifyContent:'center' }} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Request →'}
      </button>
    </form>
  )
}
