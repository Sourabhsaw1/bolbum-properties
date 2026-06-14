'use client'
import { useState, useEffect } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase/browser'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import GhostCursor from '@/components/ui/GhostCursor'

const SERVICES = [
  { icon:'🏗️', type:'construction', title:'House Construction', desc:'Complete house construction from foundation to finishing. RCC structures, brickwork, plastering by experienced contractors.', features:['New construction','Renovation','Commercial buildings','Civil work'], price:'Starting ₹1,200/sq.ft' },
  { icon:'💧', type:'borewell',      title:'Borewell Drilling',  desc:'Professional borewell drilling with modern rotary rigs. Water testing, pump installation included.', features:['Up to 500ft depth','Water testing','Pump installation','Maintenance'], price:'Starting ₹150/ft' },
  { icon:'📐', type:'3d_design',    title:'3D House Design',    desc:'Stunning 3D floor plans and renders before you build. Walkthrough videos available.', features:['2D floor plans','3D renders','Interior visuals','Walkthrough video'], price:'Starting ₹8,000' },
]

export default function ServicesPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState({ city:'', location:'', budget_min:'', budget_max:'', description:'' })
  const [sending, setSending] = useState<string|null>(null)
  const [sent, setSent]       = useState<string|null>(null)
  const [error, setError]     = useState('')

  useEffect(() => {
    const sb = getSupabaseBrowser()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      sb.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        setProfile(data); setLoading(false)
      })
    })
  }, [])

  async function book(type: string) {
    if (!profile || !form.city || !form.location) return
    setSending(type); setError('')
    const sb = getSupabaseBrowser()
    const { error } = await sb.from('service_requests').insert({
      buyer_id: profile.id, service_type: type as any,
      title: SERVICES.find(s=>s.type===type)?.title ?? type,
      description: form.description || null,
      location: form.location, city: form.city,
      budget_min: form.budget_min ? parseInt(form.budget_min) : null,
      budget_max: form.budget_max ? parseInt(form.budget_max) : null,
    })
    setSending(null)
    if (error) { setError(error.message); return }
    setSent(type)
  }

  return (
    <>
      <div className="bg-mesh" />
      <GhostCursor
        color="#FF6B1A"
        brightness={1.2}
        trailLength={40}
        inertia={0.45}
        bloomStrength={0.15}
        grainIntensity={0.03}
        fadeDelayMs={1200}
        fadeDurationMs={1800}
        zIndex={1}
      />
      <Header />
      <section className="section-pad">
        <div className="section-header">
          <div className="section-eyebrow">Beyond Listings</div>
          <h1 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.8rem,4vw,3rem)', marginBottom:12 }}>Property Services</h1>
          <p className="section-subtitle">Construction, borewell drilling, and 3D design across UP & Bihar.</p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:40, maxWidth:900, margin:'0 auto', position:'relative', zIndex:1 }}>
          {SERVICES.map(s => (
            <div key={s.type} className="dashboard-card reveal" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'start' }}>
              <div>
                <div style={{ fontSize:'2.8rem', marginBottom:12 }}>{s.icon}</div>
                <div style={{ fontSize:'0.7rem', color:'var(--orange)', letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:'monospace', marginBottom:8 }}>{s.type}</div>
                <h2 style={{ fontFamily:'Georgia,serif', marginBottom:12 }}>{s.title}</h2>
                <p style={{ color:'var(--gray-5)', lineHeight:1.75, marginBottom:16, fontSize:'0.9rem' }}>{s.desc}</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
                  {s.features.map(f => <span key={f} className="amenity-tag">{f}</span>)}
                </div>
                <div style={{ color:'var(--orange)', fontWeight:700 }}>{s.price}</div>
              </div>
              <div>
                {loading ? (
                  <div style={{ height:200, background:'var(--gray-2)', borderRadius:12 }} />
                ) : sent === s.type ? (
                  <div className="auth-message success" style={{ padding:24, textAlign:'center' }}>
                    ✓ Request submitted! Our team will contact you within 24 hours.
                  </div>
                ) : profile ? (
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    <div style={{ fontWeight:600, fontSize:'0.9rem', marginBottom:4 }}>Book {s.title}</div>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input className="form-input" placeholder="Varanasi" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Address *</label>
                        <input className="form-input" placeholder="Colony, landmark..." value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Min Budget (₹)</label>
                        <input type="number" className="form-input" placeholder="100000" value={form.budget_min} onChange={e=>setForm(f=>({...f,budget_min:e.target.value}))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Max Budget (₹)</label>
                        <input type="number" className="form-input" placeholder="500000" value={form.budget_max} onChange={e=>setForm(f=>({...f,budget_max:e.target.value}))} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Details</label>
                      <textarea className="form-input" rows={2} placeholder="Describe your requirements..." value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} style={{ resize:'vertical' }} />
                    </div>
                    {error && <div className="auth-message error">{error}</div>}
                    <button className="btn-primary" style={{ justifyContent:'center' }} disabled={sending===s.type||!form.city||!form.location} onClick={()=>book(s.type)}>
                      {sending===s.type ? 'Submitting...' : 'Submit Request →'}
                    </button>
                  </div>
                ) : (
                  <div className="dashboard-card" style={{ textAlign:'center', padding:'32px 24px' }}>
                    <div style={{ fontSize:'2rem', marginBottom:12 }}>🔐</div>
                    <p style={{ color:'var(--gray-5)', marginBottom:16, fontSize:'0.88rem' }}>Sign in to book this service</p>
                    <a href="/auth/login" className="btn-primary" style={{ display:'inline-flex' }}>Sign In to Book →</a>
                    <p style={{ marginTop:12, fontSize:'0.78rem', color:'var(--gray-4)' }}>No account? <a href="/auth/signup" style={{ color:'var(--orange)' }}>Register free →</a></p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  )
}
