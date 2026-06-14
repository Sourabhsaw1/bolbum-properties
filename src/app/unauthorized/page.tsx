export default function UnauthorizedPage() {
  return (
    <div className="unauth-page">
      <div className="bg-mesh" />
      <div className="dashboard-card" style={{ maxWidth:460, width:'100%', textAlign:'center', padding:'48px 40px', position:'relative', zIndex:1 }}>
        <div style={{ fontSize:'3rem', marginBottom:16 }}>🚫</div>
        <h2 style={{ fontFamily:'Georgia,serif', marginBottom:12 }}>Access Denied</h2>
        <p style={{ color:'var(--gray-5)', marginBottom:28 }}>You don't have permission for this page.</p>
        <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
          <a href="/" className="btn-primary">Go Home</a>
          <a href="/auth/login" className="btn-ghost">Sign In</a>
        </div>
      </div>
    </div>
  )
}
