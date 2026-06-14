'use client'
import { useEffect, useRef } from 'react'

const CSS = `
  @keyframes logoFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes glowPulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.9;transform:scale(1.08)} }
  @keyframes spinRing  { to{transform:rotate(360deg)} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scrollDot { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(13px);opacity:0} }
  @keyframes textShine {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .hero-right { display:flex; }
  @media(max-width:900px){ .hero-right{display:none!important;} .hero-grid{grid-template-columns:1fr!important;} }
`

export default function HeroSection() {
  const textRef = useRef<HTMLDivElement>(null)
  const fgRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!document.getElementById('hero-css')) {
      const el = document.createElement('style')
      el.id = 'hero-css'; el.textContent = CSS
      document.head.appendChild(el)
    }
    let t = false
    const onScroll = () => {
      if (t) return; t = true
      requestAnimationFrame(() => {
        const sy = window.scrollY
        if (textRef.current) {
          textRef.current.style.transform = `translateY(${sy * .28}px)`
          textRef.current.style.opacity   = String(Math.max(0, 1 - sy * .004))
        }
        if (fgRef.current) {
          fgRef.current.style.transform = `translateY(${sy * .15}px)`
          fgRef.current.style.opacity   = String(Math.max(0, 1 - sy * .004))
        }
        t = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive:true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section style={{ position:'relative', minHeight:'95vh', display:'flex', alignItems:'center', overflow:'hidden', padding:'80px 5vw 60px' }}>

      {/* NO background logo - removed as requested */}

      {/* Content Grid */}
      <div className="hero-grid" style={{ position:'relative', zIndex:2, display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center', maxWidth:1200, margin:'0 auto', width:'100%' }}>

        {/* Text */}
        <div ref={textRef} style={{ willChange:'transform' }}>
          <div style={{ fontSize:'0.62rem', color:'#C8762A', letterSpacing:'0.28em', textTransform:'uppercase', fontFamily:'monospace', marginBottom:20, animation:'fadeUp .8s ease .1s both' }}>
            India's Premium Real Estate Platform
          </div>
          <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:'clamp(3rem,7vw,6rem)', lineHeight:1.05, marginBottom:24, color:'#F5F0EA', animation:'fadeUp .8s ease .2s both' }}>
            Find Your<br />
            <span style={{
              fontStyle:'italic',
              background:'linear-gradient(90deg, #D4A44C, #E8C07A, #C8762A, #D4A44C)',
              backgroundSize:'200% auto',
              WebkitBackgroundClip:'text', backgroundClip:'text',
              WebkitTextFillColor:'transparent',
              animation:'textShine 4s linear infinite',
            }}>Dream</span><br />
            Property
          </h1>
          <p style={{ fontSize:'0.9rem', fontWeight:300, color:'rgba(245,240,234,0.55)', lineHeight:1.9, maxWidth:420, marginBottom:44, animation:'fadeUp .8s ease .35s both' }}>
            Buy, sell and build — premium properties, construction, borewell & 3D design services, all in one place.
          </p>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap', animation:'fadeUp .8s ease .5s both' }}>
            <a href="/properties" style={{ fontSize:'0.72rem', fontWeight:500, letterSpacing:'0.12em', textTransform:'uppercase', padding:'15px 40px', background:'#C8762A', color:'#0A0906', borderRadius:2, textDecoration:'none', boxShadow:'0 8px 32px rgba(200,118,42,0.4)', transition:'all .25s' }}>
              Browse Properties
            </a>
            <a href="/auth/signup" style={{ fontSize:'0.72rem', fontWeight:300, letterSpacing:'0.12em', textTransform:'uppercase', padding:'15px 40px', background:'transparent', color:'#F5F0EA', border:'1px solid rgba(245,240,234,0.2)', borderRadius:2, textDecoration:'none', transition:'all .25s' }}>
              List Property
            </a>
          </div>

          {/* Stats row under buttons */}
          <div style={{ display:'flex', gap:32, marginTop:48, animation:'fadeUp .8s ease .65s both' }}>
            {[{num:'1200+',label:'Properties'},{num:'500+',label:'Happy Clients'},{num:'15+',label:'Cities'}].map(s=>(
              <div key={s.label}>
                <div style={{ fontFamily:'Georgia,serif', fontSize:'1.5rem', fontWeight:300, color:'#D4A44C', lineHeight:1 }}>{s.num}</div>
                <div style={{ fontSize:'0.6rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(245,240,234,0.35)', marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Floating logo with rings */}
        <div className="hero-right" ref={fgRef} style={{ alignItems:'center', justifyContent:'center', animation:'fadeUp .8s ease .3s both', willChange:'transform' }}>
          <div style={{ position:'relative', width:320, height:320, display:'flex', alignItems:'center', justifyContent:'center', animation:'logoFloat 7s ease-in-out infinite' }}>
            {/* Glow behind */}
            <div style={{ position:'absolute', width:260, height:260, borderRadius:'50%', background:'radial-gradient(circle, rgba(200,118,42,0.18) 0%, rgba(200,118,42,0.06) 50%, transparent 70%)', animation:'glowPulse 3.5s ease-in-out infinite' }} />
            {/* Outer ring spinning */}
            <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', border:'1px solid rgba(200,118,42,0.22)', animation:'spinRing 18s linear infinite' }}>
              <div style={{ position:'absolute', top:-6, left:'50%', width:12, height:12, borderRadius:'50%', background:'#C8762A', boxShadow:'0 0 16px #C8762A, 0 0 32px rgba(200,118,42,0.4)', transform:'translateX(-50%)' }} />
              <div style={{ position:'absolute', bottom:-6, left:'50%', width:6, height:6, borderRadius:'50%', background:'rgba(200,118,42,0.5)', transform:'translateX(-50%)' }} />
            </div>
            {/* Inner ring */}
            <div style={{ position:'absolute', width:240, height:240, borderRadius:'50%', border:'1px dashed rgba(200,118,42,0.14)', animation:'spinRing 12s linear infinite reverse' }} />
            {/* Logo */}
            <img src="/logo.png" alt="Bol Bum Property" style={{ width:230, height:230, objectFit:'contain', position:'relative', zIndex:1, filter:'drop-shadow(0 0 24px rgba(200,118,42,0.5)) drop-shadow(0 0 60px rgba(200,118,42,0.2))' }} />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', gap:10, color:'rgba(245,240,234,0.28)', fontSize:'0.55rem', letterSpacing:'0.22em', textTransform:'uppercase', animation:'fadeUp .9s ease 1.1s both' }}>
        <span>Scroll</span>
        <div style={{ width:18, height:30, border:'1px solid rgba(245,240,234,0.15)', borderRadius:9, display:'flex', justifyContent:'center', alignItems:'flex-start', padding:4 }}>
          <div style={{ width:3, height:6, background:'#C8762A', borderRadius:2, animation:'scrollDot 1.6s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  )
}
