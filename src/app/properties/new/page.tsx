import Header from '@/components/layout/Header'
export default function NewPropertyPage() {
  return (
    <>
      <div className="bg-mesh" />
      <Header />
      <div className="post-page">
        <div className="post-form-card">
          <div style={{ textAlign:'center', padding:'40px 0' }}>
            <div style={{ fontSize:'3rem', marginBottom:16 }}>🏠</div>
            <h2 style={{ fontFamily:'Georgia,serif', marginBottom:12 }}>Post a Property</h2>
            <p style={{ color:'var(--gray-5)', marginBottom:24 }}>Contact admin to activate your seller plan first.</p>
            <a href="/dashboard/seller" className="btn-ghost">← Back to Dashboard</a>
          </div>
        </div>
      </div>
    </>
  )
}
