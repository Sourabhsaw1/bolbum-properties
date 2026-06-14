import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getSupabaseServer } from '@/lib/supabase/server'
import PropertyInquiryCard from '@/components/properties/PropertyInquiryCard'

function formatPrice(p: number) {
  if (p >= 10000000) return `₹${(p/10000000).toFixed(2)} Crore`
  if (p >= 100000) return `₹${(p/100000).toFixed(2)} Lakh`
  return `₹${p.toLocaleString('en-IN')}`
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const db = getSupabaseServer()
  const { data: property } = await db.from('properties_with_details').select('*').eq('id', params.id).eq('status','active').single()
  if (!property) notFound()

  const { data: amenities } = await db.from('property_amenities').select('name').eq('property_id', params.id)

  return (
    <>
      <div className="bg-mesh" />
      <Header />
      <div className="property-detail">
        <div style={{ fontSize:'0.8rem', color:'var(--gray-5)', marginBottom:24 }}>
          <a href="/" style={{color:'var(--gray-5)'}}>Home</a> → <a href="/properties" style={{color:'var(--gray-5)'}}>Properties</a> → <span style={{color:'var(--white)'}}>{(property as any).title}</span>
        </div>

        <div className="property-detail-grid">
          <div>
            <div style={{ height:380, background:'var(--gray-2)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'6rem', marginBottom:28, overflow:'hidden' }}>
              {(property as any).primary_image_url ? <img src={(property as any).primary_image_url} alt={(property as any).title} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : '🏡'}
            </div>

            <div style={{ fontSize:'0.7rem', color:'var(--orange)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8 }}>{(property as any).property_type}</div>
            <h1 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.4rem,3vw,2rem)', marginBottom:8 }}>{(property as any).title}</h1>
            <div style={{ fontSize:'0.88rem', color:'var(--gray-5)', marginBottom:16 }}>📍 {(property as any).address}, {(property as any).city}, {(property as any).state}</div>
            <div style={{ fontSize:'2rem', fontWeight:900, color:'var(--orange)', marginBottom:24 }}>{formatPrice((property as any).price)}</div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:28 }}>
              {(property as any).area_sqft && <div style={{background:'var(--gray-2)',borderRadius:10,padding:14,textAlign:'center'}}><div style={{fontWeight:700,marginBottom:4}}>{(property as any).area_sqft}</div><div style={{fontSize:'0.72rem',color:'var(--gray-5)'}}>Sq. Ft.</div></div>}
              {(property as any).bedrooms && <div style={{background:'var(--gray-2)',borderRadius:10,padding:14,textAlign:'center'}}><div style={{fontWeight:700,marginBottom:4}}>{(property as any).bedrooms}</div><div style={{fontSize:'0.72rem',color:'var(--gray-5)'}}>Bedrooms</div></div>}
              {(property as any).bathrooms && <div style={{background:'var(--gray-2)',borderRadius:10,padding:14,textAlign:'center'}}><div style={{fontWeight:700,marginBottom:4}}>{(property as any).bathrooms}</div><div style={{fontSize:'0.72rem',color:'var(--gray-5)'}}>Bathrooms</div></div>}
            </div>

            {(property as any).description && <p style={{color:'var(--gray-6)',lineHeight:1.8,marginBottom:28}}>{(property as any).description}</p>}

            {amenities && amenities.length > 0 && (
              <div className="detail-amenities">
                {amenities.map((a: any) => <span key={a.name} className="amenity-tag">{a.name}</span>)}
              </div>
            )}
          </div>

          <div>
            <PropertyInquiryCard
              propertyId={property.id}
              sellerId={(property as any).seller_id}
              sellerName={(property as any).seller_name}
              sellerPhone={(property as any).seller_phone}
              propertyTitle={property.title}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
