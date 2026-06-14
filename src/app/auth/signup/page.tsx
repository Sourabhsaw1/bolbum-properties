'use client'
import { useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase/browser'

const ROLES = [
  { value: 'buyer',  label: '🛒 Buyer',  desc: 'Browse, save & inquire about properties' },
  { value: 'seller', label: '🏘️ Seller', desc: 'List properties for sale' },
  { value: 'user',   label: '👁️ Viewer', desc: 'Browse freely' },
]

const DASH: Record<string,string> = {
  admin: '/dashboard/admin', seller: '/dashboard/seller',
  buyer: '/dashboard/buyer', user: '/dashboard/user',
}

export default function SignupPage() {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [role,     setRole]     = useState('buyer')
  const [msg,      setMsg]      = useState('')
  const [ok,       setOk]       = useState(false)
  const [loading,  setLoading]  = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) { setMsg('Password must be at least 6 characters'); setOk(false); return }
    setLoading(true); setMsg('')

    const supabase = getSupabaseBrowser()

    // Sign up
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, role } },
    })

    if (error) {
      const friendlyMsg = error.message.includes('Database error')
        ? '⚠️ Server setup issue — signup temporarily unavailable. Admin ko contact karo ya thodi der baad try karo.'
        : error.message
      setMsg(friendlyMsg); setOk(false); setLoading(false); return
    }

    // Manually create profile in case trigger didn't fire
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: name,
        role: role as any,
        is_verified: false,
        is_approved: false,
      }, { onConflict: 'id' })
    }

    // Auto login
    const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password })
    if (loginErr) { setMsg('Account created! Please sign in.'); setOk(true); setLoading(false); return }

    setMsg('Account created! Redirecting...'); setOk(true); setLoading(false)
    window.location.href = DASH[role] ?? '/dashboard/user'
  }

  return (
    <div className="auth-page">
      <div className="bg-mesh" />
      <div className="auth-card">
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div className="logo" style={{ justifyContent:'center', marginBottom:12 }}>
            <div className="logo-dot" /> Bol Bum <span>&nbsp;Property</span>
          </div>
          <div className="auth-title">Create account</div>
          <div className="auth-subtitle">Join thousands of property buyers & sellers</div>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input type="text" required className="auth-input" placeholder="Rajesh Kumar" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" required className="auth-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" required className="auth-input" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">I want to...</label>
            <div className="role-options">
              {ROLES.map(r => (
                <label key={r.value} className={`role-option${role === r.value ? ' selected' : ''}`}>
                  <input type="radio" name="role" value={r.value} checked={role === r.value} onChange={() => setRole(r.value)} style={{ display:'none' }} />
                  <span className="role-label">{r.label}</span>
                  <span className="role-desc">{r.desc}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ justifyContent:'center' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account →'}
          </button>
        </form>

        {msg && <div className={`auth-message ${ok ? 'success' : 'error'}`}>{msg}</div>}
        <p className="auth-footer-text">Already have an account? <a href="/auth/login" className="auth-link">Sign in →</a></p>
      </div>
    </div>
  )
}
