import Header from '@/components/layout/Header'
import { getServerProfile } from '@/lib/supabase/server'
export default async function UserDashboard() {
  const profile = await getServerProfile()
  return (
    <>
      <div className="bg-mesh" />
      <Header />
      <div className="dashboard-page">
        <div className="dashboard-header"><div><div className="dashboard-eyebrow">My Account</div><h1 className="dashboard-title">{profile?.full_name ?? 'Welcome'} 👋</h1></div></div>
        <div className="dashboard-card" style={{textAlign:'center',padding:'44px 32px'}}>
          <div style={{fontSize:'3rem',marginBottom:16}}>🏡</div>
          <h2 style={{fontFamily:'Georgia,serif',fontSize:'1.3rem',marginBottom:10}}>Upgrade your account</h2>
          <p style={{color:'var(--gray-5)',marginBottom:24}}>Save properties, contact sellers & book services.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center'}}>
            <a href="/auth/signup" className="btn-primary">Upgrade to Buyer</a>
          </div>
        </div>
      </div>
    </>
  )
}
