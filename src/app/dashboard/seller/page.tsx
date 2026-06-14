import Header from '@/components/layout/Header'
import { getSupabaseServer, getServerProfile } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function SellerDashboard() {
  const profile = await getServerProfile()
  const db = getSupabaseServer()

  const [propertiesResult, inquiriesResult] = await Promise.all([
    db.from('properties')
      .select('id,title,status,price,views_count,city')
      .eq('seller_id', profile?.id ?? '')
      .order('created_at', { ascending: false }),
    db.from('inquiries')
      .select(`
        id,
        message,
        created_at,
        is_read,
        properties (
          id,
          title
        ),
        buyer:profiles!inquiries_from_user_id_fkey (
          id,
          full_name,
          phone,
          avatar_url
        )
      `)
      .eq('to_user_id', profile?.id ?? '')
      .order('created_at', { ascending: false })
  ])

  const properties = propertiesResult.data
  const inquiries = inquiriesResult.data

  return (
    <>
      <div className="bg-mesh" />
      <Header />
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div><div className="dashboard-eyebrow">Seller Dashboard</div><h1 className="dashboard-title">{profile?.full_name ?? 'Seller'} 🏘️</h1></div>
          <a href="/properties/new" className="btn-primary btn-sm">+ New Listing</a>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-title">🏠 My Listings</div>
          {properties && properties.length > 0 ? properties.map((p:any) => (
            <div key={p.id} className="dashboard-row">
              <div><div className="dashboard-row-title">{p.title}</div><div className="dashboard-row-sub">₹{Number(p.price).toLocaleString('en-IN')} · {p.city} · {p.views_count} views</div></div>
              <span className={`status-pill ${p.status}`}>{p.status}</span>
            </div>
          )) : <p style={{color:'var(--gray-5)',fontSize:'0.88rem'}}>No listings yet. <a href="/properties/new" style={{color:'var(--orange)'}}>Post one →</a></p>}
        </div>

        <div className="dashboard-card" style={{ marginTop: 32 }}>
          <div className="dashboard-card-title">✉️ Received Inquiries</div>
          {inquiries && inquiries.length > 0 ? inquiries.map((inq: any) => (
            <div key={inq.id} className="dashboard-row" style={{ alignItems: 'flex-start', padding: '16px 0' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#F5F0EA' }}>
                    👤 {inq.buyer?.full_name || 'Interested Buyer'}
                  </div>
                  {inq.buyer?.phone && (
                    <a href={`tel:${inq.buyer.phone}`} style={{ fontSize: '0.78rem', color: 'var(--orange)', textDecoration: 'underline' }}>
                      📞 {inq.buyer.phone}
                    </a>
                  )}
                  <span style={{ fontSize: '0.7rem', color: 'var(--gray-5)' }}>
                    · {new Date(inq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-6)', background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', marginTop: 8, lineHeight: 1.5 }}>
                  "{inq.message}"
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-5)', marginTop: 8 }}>
                  Property: <a href={`/properties/${inq.properties?.id}`} style={{ color: 'var(--orange)', textDecoration: 'none', fontWeight: 600 }}>{inq.properties?.title}</a>
                </div>
              </div>
            </div>
          )) : (
            <p style={{ color: 'var(--gray-5)', fontSize: '0.88rem' }}>No inquiries received yet.</p>
          )}
        </div>
      </div>
    </>
  )
}
