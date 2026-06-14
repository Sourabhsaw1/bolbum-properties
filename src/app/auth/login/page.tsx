'use client'
import { useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [msg,      setMsg]      = useState('')
  const [isErr,    setIsErr]    = useState(false)
  const [loading,  setLoading]  = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg(''); setIsErr(false)

    const sb = getSupabaseBrowser()
    const { data, error } = await sb.auth.signInWithPassword({ email, password })

    if (error) {
      setMsg(error.message)
      setIsErr(true)
      setLoading(false)
      return
    }

    setMsg('✓ Login successful!')

    // Get role
    let dest = '/dashboard/user'
    try {
      const { data: p } = await sb
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()
      const map: Record<string,string> = {
        admin:  '/dashboard/admin',
        seller: '/dashboard/seller',
        buyer:  '/dashboard/buyer',
        user:   '/dashboard/user',
      }
      dest = map[p?.role ?? 'user'] ?? '/dashboard/user'
    } catch {}

    // Check if there is a 'next' query param to redirect back to
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const nextParam = urlParams.get('next')
      if (nextParam) {
        dest = nextParam
      }
    } catch (e) {}

    setLoading(false)

    // Use both methods for reliability
    try {
      router.push(dest)
      router.refresh()
    } catch {}
    setTimeout(() => { window.location.href = dest }, 300)
  }

  const inp = {
    width:'100%', padding:'12px 16px', borderRadius:8,
    background:'rgba(255,255,255,0.05)',
    border:'1px solid rgba(245,240,234,0.1)',
    color:'#F5F0EA', fontSize:'0.9rem', outline:'none',
    boxSizing:'border-box' as const, fontFamily:'inherit',
    transition:'border-color .2s',
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#090806', padding:20, position:'relative' }}>
      <div className="bg-mesh" />

      {/* Subtle bg glow */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(200,118,42,0.06) 0%, transparent 70%)' }} />

      <div style={{
        background:'rgba(18,14,8,0.9)', backdropFilter:'blur(28px)',
        border:'1px solid rgba(200,118,42,0.15)',
        borderRadius:20, padding:'48px 44px', width:'100%', maxWidth:420,
        boxShadow:'0 40px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
        position:'relative', zIndex:1,
      }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ position:'relative', display:'inline-block', marginBottom:14 }}>
            <img src="/logo.png" alt="Bol Bum" style={{ width:76, height:76, objectFit:'contain', filter:'drop-shadow(0 0 20px rgba(200,118,42,0.5))' }} />
          </div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:'1.15rem', color:'#F5F0EA', letterSpacing:'0.04em' }}>
            Bol Bum <span style={{ color:'#C8762A' }}>Property</span>
          </div>
        </div>

        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:'1.3rem', fontWeight:600, color:'#F5F0EA', marginBottom:6 }}>Welcome back</div>
          <div style={{ fontSize:'0.82rem', color:'rgba(245,240,234,0.4)' }}>Sign in to continue to your dashboard</div>
        </div>

        <form onSubmit={onSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div>
            <label style={{ display:'block', fontSize:'0.7rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(245,240,234,0.4)', marginBottom:8 }}>Email address</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="you@example.com" autoComplete="email" style={inp}
              onFocus={e=>e.target.style.borderColor='rgba(200,118,42,0.7)'}
              onBlur={e=>e.target.style.borderColor='rgba(245,240,234,0.1)'} />
          </div>

          <div>
            <label style={{ display:'block', fontSize:'0.7rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(245,240,234,0.4)', marginBottom:8 }}>Password</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)}
              placeholder="••••••••" autoComplete="current-password" style={inp}
              onFocus={e=>e.target.style.borderColor='rgba(200,118,42,0.7)'}
              onBlur={e=>e.target.style.borderColor='rgba(245,240,234,0.1)'} />
          </div>

          <button type="submit" disabled={loading} style={{
            width:'100%', padding:'14px', marginTop:4, borderRadius:8,
            background: loading ? 'rgba(200,118,42,0.5)' : 'linear-gradient(135deg, #C8762A, #E8902A)',
            color:'#0A0906', fontSize:'0.8rem', fontWeight:700,
            letterSpacing:'0.12em', textTransform:'uppercase',
            border:'none', cursor:loading?'not-allowed':'pointer',
            boxShadow: loading ? 'none' : '0 4px 24px rgba(200,118,42,0.4)',
            transition:'all .25s',
          }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        {msg && (
          <div style={{
            marginTop:16, padding:'11px 16px', borderRadius:8,
            fontSize:'0.82rem', textAlign:'center',
            background: isErr ? 'rgba(248,113,113,0.08)' : 'rgba(74,222,128,0.08)',
            color: isErr ? '#F87171' : '#4ADE80',
            border: `1px solid ${isErr ? 'rgba(248,113,113,0.2)' : 'rgba(74,222,128,0.2)'}`,
          }}>{msg}</div>
        )}

        <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid rgba(245,240,234,0.06)', textAlign:'center' }}>
          <p style={{ fontSize:'0.8rem', color:'rgba(245,240,234,0.3)' }}>
            No account?{' '}
            <a href="/auth/signup" style={{ color:'#C8762A', textDecoration:'none', fontWeight:500 }}>Create one →</a>
          </p>
        </div>
      </div>
    </div>
  )
}
