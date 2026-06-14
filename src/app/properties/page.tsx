import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getSupabaseServer } from '@/lib/supabase/server'

function formatPrice(p: number) {
  if (p >= 10000000) return `₹${(p/10000000).toFixed(1)} Cr`
  if (p >= 100000) return `₹${(p/100000).toFixed(1)} L`
  return `₹${p.toLocaleString('en-IN')}`
}

export default async function PropertiesPage({ searchParams }: { searchParams: any }) {
  const db = getSupabaseServer()
  let query = db.from('properties_with_details').select('*').eq('status','active')
  if (searchParams.type) query = query.eq('property_type', searchParams.type)
  if (searchParams.q) query = query.or(`title.ilike.%${searchParams.q}%,city.ilike.%${searchParams.q}%`)
  if (searchParams.maxPrice) query = query.lte('price', parseInt(searchParams.maxPrice))
  query = query.order('is_featured',{ascending:false}).order('created_at',{ascending:false}).limit(30)
  const { data: properties } = await query

  return (
    <>
      <div className="bg-mesh" />
      <Header />
      <section className="section-pad">
        <form method="GET" style={{ marginBottom: 36, position:'relative',zIndex:1 }}>
          <div className="search-box" style={{ maxWidth:'100%' }}>
            <input name="q" type="text" className="search-input" placeholder="Search location, city…" defaultValue={searchParams.q ?? ''} />
            <select name="type" className="search-select" defaultValue={searchParams.type ?? ''}>
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="flat">Flat</option>
              <option value="plot">Plot</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
            <select name="maxPrice" className="search-select" defaultValue={searchParams.maxPrice ?? ''}>
              <option value="">Any Price</option>
              <option value="2000000">Under ₹20L</option>
              <option value="5000000">Under ₹50L</option>
              <option value="10000000">Under ₹1Cr</option>
            </select>
            <button type="submit" className="search-btn">🔍 Search</button>
          </div>
        </form>

        <div style={{ marginBottom:24, color:'var(--gray-5)', fontSize:'0.85rem', position:'relative',zIndex:1 }}>
          {properties?.length ?? 0} properties found
        </div>

        {properties && properties.length > 0 ? (
          <div className="properties-grid" style={{ position:'relative',zIndex:1 }}>
            {properties.map((p: any) => (
              <a key={p.id} href={`/properties/${p.id}`} className="property-card reveal">
                <div className="property-card-image">
                  {p.primary_image_url ? <img src={p.primary_image_url} alt={p.title} /> : '🏡'}
                  {p.is_featured && <span className="property-card-badge featured">★ Featured</span>}
                </div>
                <div className="property-card-body">
                  <div className="property-card-type">{p.property_type}</div>
                  <div className="property-card-title">{p.title}</div>
                  <div className="property-card-location">📍 {p.city}{p.state ? `, ${p.state}` : ''}</div>
                  <div className="property-card-price">{formatPrice(p.price)}</div>
                  <div className="property-card-stats">
                    {p.area_sqft && <div className="property-card-stat"><strong>{p.area_sqft}</strong> sqft</div>}
                    {p.bedrooms && <div className="property-card-stat"><strong>{p.bedrooms}</strong> bed</div>}
                    {p.bathrooms && <div className="property-card-stat"><strong>{p.bathrooms}</strong> bath</div>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No properties found</div>
            <a href="/properties" className="btn-ghost" style={{ marginTop:20, display:'inline-flex' }}>Clear filters</a>
          </div>
        )}
      </section>
      <Footer />
    </>
  )
}
