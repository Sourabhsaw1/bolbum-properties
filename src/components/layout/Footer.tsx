export default function Footer() {
  return (
    <footer>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginBottom:16 }}>
        <img src="/logo.png" alt="Bol Bum" style={{ width:48, height:48, objectFit:'contain', filter:'drop-shadow(0 0 8px rgba(255,107,26,0.4))' }} />
        <div style={{ textAlign:'left' }}>
          <div style={{ color:'var(--orange)', fontFamily:'Georgia,serif', fontSize:'1.1rem', fontWeight:700 }}>Bol Bum Property</div>
          <div style={{ fontSize:'0.72rem', color:'var(--gray-5)', letterSpacing:'0.1em' }}>PROPERTY & CONSTRUCTION</div>
        </div>
      </div>
      <p style={{ color:'var(--gray-5)', marginBottom:16, fontSize:'0.85rem' }}>Premium Real Estate · Varanasi, Uttar Pradesh</p>
      <div style={{ display:'flex', gap:24, justifyContent:'center', flexWrap:'wrap', marginBottom:20 }}>
        <a href="/properties" style={{ color:'var(--gray-5)', fontSize:'0.82rem' }}>Browse Properties</a>
        <a href="/services"   style={{ color:'var(--gray-5)', fontSize:'0.82rem' }}>Services</a>
        <a href="/auth/login" style={{ color:'var(--gray-5)', fontSize:'0.82rem' }}>Sign In</a>
        <a href="/auth/signup"style={{ color:'var(--gray-5)', fontSize:'0.82rem' }}>Register</a>
      </div>
      <div style={{ borderTop:'1px solid var(--border-subtle)', paddingTop:16, fontSize:'0.72rem', opacity:0.4 }}>
        © 2025 Bol Bum Property & Construction. All rights reserved.
      </div>
    </footer>
  )
}
