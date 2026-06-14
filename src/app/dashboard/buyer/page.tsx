import Header from '@/components/layout/Header'
import { getSupabaseServer, getServerProfile } from '@/lib/supabase/server'
export default async function BuyerDashboard() {
  const profile = await getServerProfile()
  const db = getSupabaseServer()
  const { data: wishlist } = await db.from('wishlists').select('property_id, properties(id,title,price,city)').eq('user_id', profile?.id ?? '').limit(6)
  return (
    <>
      <div className="bg-mesh" />
      <Header />
      <div className="dashboard-page">
        <div className="dashboard-header"><div><div className="dashboard-eyebrow">Buyer Dashboard</div><h1 className="dashboard-title">{profile?.full_name ?? 'Buyer'} 🛒</h1></div></div>
        <div className="dashboard-card">
          <div className="dashboard-card-title">❤️ Saved Properties <a href="/properties" style={{color:'var(--orange)',fontSize:'0.78rem'}}>Browse →</a></div>
          {wishlist && wishlist.length > 0 ? wishlist.map((w:any) => (
            <div key={w.property_id} className="dashboard-row">
              <div><div className="dashboard-row-title">{w.properties?.title}</div></div>
              <a href={`/properties/${w.property_id}`} className="btn-ghost btn-xs">View</a>
            </div>
          )) : <p style={{color:'var(--gray-5)',fontSize:'0.88rem'}}>No saved properties yet. <a href="/properties" style={{color:'var(--orange)'}}>Browse now →</a></p>}
        </div>
      </div>
    </>
  )
}
