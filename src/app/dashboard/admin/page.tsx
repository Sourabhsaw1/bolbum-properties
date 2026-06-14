import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getSupabaseServer } from '@/lib/supabase/server'
import ApproveRejectButtons from '@/components/admin/ApproveRejectButtons'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const db = getSupabaseServer()
  const { data: { user } } = await db.auth.getUser()
  console.log('ADMIN DASHBOARD DEBUG - User:', user)
  if (user) {
    const { data: profile } = await db.from('profiles').select('*').eq('id', user.id).single()
    console.log('ADMIN DASHBOARD DEBUG - Profile:', profile)
  }

  const [
    { count: total },
    { count: pending },
    { count: users },
    { count: active },
    { data: pendingList },
    { data: recentUsers },
    { data: inquiriesList },
  ] = await Promise.all([
    db.from('properties').select('*', { count: 'exact', head: true }),
    db.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('profiles').select('*', { count: 'exact', head: true }),
    db.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    db.from('properties').select('id,title,property_type,price,created_at').eq('status', 'pending').order('created_at', { ascending: false }).limit(10),
    db.from('profiles').select('id,full_name,role,created_at').order('created_at', { ascending: false }).limit(8),
    db.from('inquiries').select(`
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
        phone
      ),
      seller:profiles!inquiries_to_user_id_fkey (
        id,
        full_name,
        phone
      )
    `).order('created_at', { ascending: false }).limit(10),
  ])

  // Write debug logs to a file in the workspace
  const fs = require('fs');
  const path = require('path');
  const logData = {
    timestamp: new Date().toISOString(),
    user: user,
    inquiriesCount: inquiriesList?.length ?? 0,
    inquiriesData: inquiriesList,
    total: total,
    pending: pending,
    users: users,
  };
  fs.writeFileSync(path.join(process.cwd(), 'scratch', 'admin_debug.txt'), JSON.stringify(logData, null, 2));

  return (
    <>
      <div className="bg-mesh" />
      <Header />
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <div className="dashboard-eyebrow">Admin Panel</div>
            <h1 className="dashboard-title">Dashboard 👑</h1>
          </div>
        </div>

        <div className="stats-grid">
          {[
            { icon: '🏠', label: 'Total Properties', value: total ?? 0 },
            { icon: '✅', label: 'Active', value: active ?? 0 },
            { icon: '⏳', label: 'Pending', value: pending ?? 0 },
            { icon: '👥', label: 'Users', value: users ?? 0 },
          ].map(s => (
            <div key={s.label} className="stat-card reveal">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="dashboard-card reveal">
          <div className="dashboard-card-title">⏳ Pending Approval</div>
          {pendingList && pendingList.length > 0 ? pendingList.map(p => (
            <div key={p.id} className="dashboard-row">
              <div>
                <div className="dashboard-row-title">{p.title}</div>
                <div className="dashboard-row-sub">{p.property_type} · ₹{Number(p.price).toLocaleString('en-IN')}</div>
              </div>
              <ApproveRejectButtons propertyId={p.id} title={p.title} />
            </div>
          )) : <p style={{ color: 'var(--gray-5)', fontSize: '0.88rem' }}>✓ No pending listings.</p>}
        </div>

        <div className="dashboard-card reveal">
          <div className="dashboard-card-title">✉️ All User Inquiries (Recent)</div>
          {inquiriesList && inquiriesList.length > 0 ? inquiriesList.map((inq: any) => (
            <div key={inq.id} className="dashboard-row" style={{ alignItems: 'flex-start', padding: '16px 0' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#F5F0EA' }}>
                    👤 {inq.buyer?.full_name || 'Buyer'} ➡️ 👤 {inq.seller?.full_name || 'Seller'}
                  </div>
                  {inq.buyer?.phone && (
                    <a href={`tel:${inq.buyer.phone}`} style={{ fontSize: '0.78rem', color: 'var(--orange)', textDecoration: 'underline' }}>
                      📞 Buyer: {inq.buyer.phone}
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
          )) : <p style={{ color: 'var(--gray-5)', fontSize: '0.88rem' }}>No inquiries submitted yet.</p>}
        </div>

        <div className="dashboard-card reveal">
          <div className="dashboard-card-title">👥 Recent Users</div>
          {recentUsers?.map(u => (
            <div key={u.id} className="dashboard-row">
              <div>
                <div className="dashboard-row-title">{u.full_name ?? 'Unnamed'}</div>
                <div className="dashboard-row-sub">{u.role} · {new Date(u.created_at).toLocaleDateString('en-IN')}</div>
              </div>
              <span className="status-pill active">{u.role}</span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}
