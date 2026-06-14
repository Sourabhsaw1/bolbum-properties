'use client'
import { useState, useEffect } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase/browser'

interface PropertyInquiryCardProps {
  propertyId: string
  sellerId: string
  sellerName: string
  sellerPhone?: string
  propertyTitle: string
}

export default function PropertyInquiryCard({ propertyId, sellerId, sellerName, sellerPhone, propertyTitle }: PropertyInquiryCardProps) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setMessage(`Hi, I am interested in your property "${propertyTitle}". Please contact me with more details.`)

    const supabase = getSupabaseBrowser()
    async function checkSession() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
          if (data) {
            setProfile(data)
          }
        }
      } catch (err) {
        console.error('Failed to get session in inquiry card:', err)
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [propertyId, propertyTitle])

  async function handleSendInquiry(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    setError('')

    const supabase = getSupabaseBrowser()

    const { error } = await supabase.from('inquiries').insert({
      from_user_id: user.id,
      to_user_id: sellerId,
      property_id: propertyId,
      message: message,
      is_read: false
    })

    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  return (
    <div className="contact-card" style={{
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(200, 118, 42, 0.15)',
      borderRadius: 16,
      padding: '24px 20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      color: '#F5F0EA'
    }}>
      <div style={{ fontWeight: 600, fontSize: '1rem', letterSpacing: '0.05em', color: '#D4A44C', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>📞</span> Contact & Inquiry
      </div>

      <div style={{ marginBottom: 16, padding: '12px 14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(245, 240, 234, 0.05)', borderRadius: 10, fontSize: '0.85rem' }}>
        <div style={{ fontSize: '0.72rem', color: 'rgba(245, 240, 234, 0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Listed By</div>
        <div style={{ fontWeight: 600, color: '#F5F0EA' }}>{sellerName || 'Property Owner'}</div>
      </div>

      {sellerPhone && (
        <a href={`https://wa.me/91${sellerPhone}?text=Hi, I am interested in your property "${propertyTitle}" (ID: ${propertyId}). Please share more details.`}
          target="_blank" rel="noopener noreferrer"
          className="btn-primary" style={{
            width: '100%',
            justifyContent: 'center',
            marginBottom: 16,
            color: '#25D366',
            background: 'rgba(37,211,102,0.12)',
            border: '1px solid rgba(37,211,102,0.35)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            padding: '12px 16px',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.25s'
          }}>
          <span style={{ fontSize: '1.1rem' }}>💬</span> WhatsApp Seller
        </a>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 0' }}>
          <div style={{ height: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 4, width: '60%', animation: 'pulse 1.5s infinite' }} />
          <div style={{ height: 40, background: 'rgba(255,255,255,0.05)', borderRadius: 8, animation: 'pulse 1.5s infinite' }} />
        </div>
      ) : sent ? (
        <div style={{
          background: 'rgba(74, 222, 128, 0.08)',
          border: '1px solid rgba(74, 222, 128, 0.2)',
          borderRadius: 10,
          padding: '16px',
          color: '#4ADE80',
          fontSize: '0.82rem',
          textAlign: 'center',
          lineHeight: 1.6,
          marginTop: 8
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>✓</div>
          <strong>Inquiry Submitted!</strong><br />
          The seller has been notified and will contact you back soon.
        </div>
      ) : user ? (
        <form onSubmit={handleSendInquiry} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          <div style={{ fontSize: '0.72rem', color: 'rgba(245, 240, 234, 0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Send Direct Message</div>
          <textarea
            required
            rows={4}
            value={message}
            onChange={e => setMessage(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(245,240,234,0.1)',
              color: '#F5F0EA',
              fontSize: '0.82rem',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
          />
          {error && <div style={{ color: '#F87171', fontSize: '0.75rem' }}>⚠️ {error}</div>}
          <button type="submit" disabled={submitting} className="btn-primary" style={{
            width: '100%',
            justifyContent: 'center',
            padding: '12px',
            borderRadius: 8,
            fontSize: '0.82rem',
            background: 'linear-gradient(135deg, #C8762A, #E8902A)',
            color: '#0A0906',
            fontWeight: 700,
            border: 'none',
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}>
            {submitting ? 'Sending...' : 'Send Inquiry ✉️'}
          </button>
        </form>
      ) : (
        <div style={{ marginTop: 8 }}>
          <a href={`/auth/login?next=/properties/${propertyId}`} className="btn-ghost" style={{
            width: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            textDecoration: 'none',
            fontSize: '0.82rem',
            padding: '11px 16px',
            borderRadius: 8,
            display: 'block',
            border: '1px solid rgba(200, 118, 42, 0.4)',
            color: '#C8762A',
            background: 'rgba(200, 118, 42, 0.04)',
            transition: 'all 0.25s'
          }}>
            🔐 Sign In to Inquire
          </a>
          <div style={{ fontSize: '0.7rem', color: 'rgba(245, 240, 234, 0.3)', textAlign: 'center', marginTop: 10 }}>
            Log in to your account to send direct inquiries to the owner.
          </div>
        </div>
      )}
    </div>
  )
}
