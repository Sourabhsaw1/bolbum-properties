import Header from '@/components/layout/Header'
import HeroSection from '@/components/ui/HeroSection'
import VideoBackground from '@/components/ui/VideoBackground'
import { getSupabaseServer } from '@/lib/supabase/server'

function fmt(p: number) {
  if (p >= 10000000) return `₹${(p/10000000).toFixed(1)} Cr`
  if (p >= 100000)   return `₹${(p/100000).toFixed(1)} L`
  return `₹${p.toLocaleString('en-IN')}`
}

export default async function HomePage() {
  const db = getSupabaseServer()
  let featured: any[] = [], recent: any[] = []
  try {
    const [f,r] = await Promise.all([
      db.from('properties_with_details').select('*').eq('status','active').eq('is_featured',true).limit(3),
      db.from('properties_with_details').select('*').eq('status','active').order('created_at',{ascending:false}).limit(6),
    ])
    featured = f.data ?? []; recent = r.data ?? []
  } catch {}

  return (
    <>
      <VideoBackground />
      <div style={{position:'relative',zIndex:2}}>
        <Header />
        <HeroSection />

        {/* Stats */}
        <div style={{display:'flex',justifyContent:'center',margin:'0 5vw 60px',flexWrap:'wrap',borderTop:'1px solid rgba(245,240,234,0.06)',borderBottom:'1px solid rgba(245,240,234,0.06)'}}>
          {[{num:'1,200+',label:'Properties Listed'},{num:'500+',label:'Happy Clients'},{num:'15+',label:'Cities Covered'},{num:'3',label:'Services'}].map((s,i)=>(
            <div key={s.label} style={{flex:1,minWidth:140,textAlign:'center',padding:'28px 20px',borderRight:i<3?'1px solid rgba(245,240,234,0.06)':''}}>
              <div style={{fontFamily:'Georgia,serif',fontSize:'2.2rem',fontWeight:300,color:'#D4A44C',lineHeight:1,marginBottom:6}}>{s.num}</div>
              <div style={{fontSize:'0.6rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(245,240,234,0.35)'}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <section style={{padding:'0 5vw 60px'}}>
            <div style={{textAlign:'center',marginBottom:40}}>
              <div style={{fontSize:'0.6rem',color:'#C8762A',letterSpacing:'0.22em',textTransform:'uppercase',fontFamily:'monospace',marginBottom:10}}>Hand-picked</div>
              <h2 style={{fontFamily:'Georgia,serif',fontWeight:300,fontSize:'clamp(1.8rem,3vw,2.8rem)',color:'#F5F0EA'}}>Featured Properties</h2>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:24,maxWidth:1200,margin:'0 auto'}}>
              {featured.map((p:any)=><Card key={p.id} p={p} />)}
            </div>
          </section>
        )}

        {/* Recent */}
        <section style={{padding:'0 5vw 80px'}}>
          <div style={{textAlign:'center',marginBottom:40}}>
            <div style={{fontSize:'0.6rem',color:'#C8762A',letterSpacing:'0.22em',textTransform:'uppercase',fontFamily:'monospace',marginBottom:10}}>Just Listed</div>
            <h2 style={{fontFamily:'Georgia,serif',fontWeight:300,fontSize:'clamp(1.8rem,3vw,2.8rem)',color:'#F5F0EA'}}>Latest Properties</h2>
          </div>
          {recent.length > 0 ? (
            <>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:24,maxWidth:1200,margin:'0 auto 40px'}}>
                {recent.map((p:any)=><Card key={p.id} p={p} />)}
              </div>
              <div style={{textAlign:'center'}}><a href="/properties" style={{fontSize:'0.7rem',letterSpacing:'0.12em',textTransform:'uppercase',padding:'12px 36px',border:'1px solid rgba(245,240,234,0.2)',borderRadius:2,color:'#F5F0EA',textDecoration:'none'}}>View All Properties →</a></div>
            </>
          ) : (
            <div style={{textAlign:'center',padding:'60px 0',color:'rgba(245,240,234,0.35)'}}>
              <div style={{fontSize:'3rem',marginBottom:12}}>🏗️</div><div>No listings yet</div>
            </div>
          )}
        </section>

        {/* Services */}
        <section style={{padding:'0 5vw 80px'}}>
          <div style={{textAlign:'center',marginBottom:40}}>
            <div style={{fontSize:'0.6rem',color:'#C8762A',letterSpacing:'0.22em',textTransform:'uppercase',fontFamily:'monospace',marginBottom:10}}>Beyond Listings</div>
            <h2 style={{fontFamily:'Georgia,serif',fontWeight:300,fontSize:'clamp(1.8rem,3vw,2.8rem)',color:'#F5F0EA'}}>Our Services</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:20,maxWidth:860,margin:'0 auto'}}>
            {[
              {icon:'🏗️',title:'House Construction',desc:'Complete construction from foundation to finishing.',price:'From ₹1,200/sq.ft'},
              {icon:'💧',title:'Borewell Drilling',desc:'Professional drilling with water testing included.',price:'From ₹150/ft'},
              {icon:'📐',title:'3D House Design',desc:'Stunning renders before you break ground.',price:'From ₹8,000'},
            ].map(s=>(
              <a key={s.title} href="/services" style={{textDecoration:'none'}}>
                <div style={{background:'rgba(255,255,255,0.03)',backdropFilter:'blur(16px)',border:'1px solid rgba(245,240,234,0.08)',borderRadius:16,padding:'28px 24px',transition:'all .25s'}}>
                  <div style={{fontSize:'2rem',marginBottom:14}}>{s.icon}</div>
                  <div style={{fontFamily:'Georgia,serif',fontSize:'1.05rem',color:'#F5F0EA',marginBottom:8}}>{s.title}</div>
                  <div style={{fontSize:'0.76rem',color:'rgba(245,240,234,0.45)',lineHeight:1.7,marginBottom:12}}>{s.desc}</div>
                  <div style={{fontSize:'0.7rem',color:'#C8762A'}}>{s.price}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Liquid Glass Footer */}
        <footer style={{margin:'0 24px 24px',borderRadius:20,padding:'40px',background:'rgba(255,255,255,0.015)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',border:'1px solid rgba(200,118,42,0.12)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.06)',color:'rgba(245,240,234,0.55)'}}>
          <div style={{display:'grid',gridTemplateColumns:'1.8fr 1fr 1fr 1fr',gap:36,marginBottom:36}}>
            <div>
              <img src="/logo.png" alt="" style={{width:52,height:52,objectFit:'contain',filter:'drop-shadow(0 0 10px rgba(200,118,42,0.4))',marginBottom:12}} />
              <div style={{fontFamily:'Georgia,serif',fontSize:'1.1rem',color:'#F5F0EA',marginBottom:4}}>Bol Bum <span style={{color:'#C8762A'}}>Property</span></div>
              <div style={{fontSize:'0.56rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(245,240,234,0.25)',marginBottom:14}}>Property & Construction</div>
              <p style={{fontSize:'0.74rem',fontWeight:300,lineHeight:1.8,color:'rgba(245,240,234,0.4)',maxWidth:220}}>Premium real estate for buyers, sellers & builders across Uttar Pradesh.</p>
            </div>
            {[
              {title:'Properties',links:[{l:'Houses',h:'/properties?type=house'},{l:'Flats',h:'/properties?type=flat'},{l:'Plots',h:'/properties?type=plot'},{l:'Land',h:'/properties?type=land'},{l:'Commercial',h:'/properties?type=commercial'}]},
              {title:'Services',links:[{l:'House Construction',h:'/services'},{l:'Borewell Drilling',h:'/services'},{l:'3D House Design',h:'/services'},{l:'Renovation',h:'/services'},{l:'Site Survey',h:'/services'}]},
              {title:'Account',links:[{l:'Sign In',h:'/auth/login'},{l:'Register',h:'/auth/signup'},{l:'Seller Dashboard',h:'/dashboard/seller'},{l:'Buyer Dashboard',h:'/dashboard/buyer'},{l:'Admin Panel',h:'/dashboard/admin'}]},
            ].map(col=>(
              <div key={col.title}>
                <h4 style={{fontSize:'0.58rem',fontWeight:500,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(245,240,234,0.8)',marginBottom:16}}>{col.title}</h4>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10}}>
                  {col.links.map(lk=><li key={lk.l}><a href={lk.h} style={{fontSize:'0.72rem',fontWeight:300,color:'rgba(245,240,234,0.38)',textDecoration:'none'}}>{lk.l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{paddingTop:20,borderTop:'1px solid rgba(245,240,234,0.07)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:14}}>
            <p style={{fontSize:'0.56rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(245,240,234,0.22)'}}>© 2025 Bol Bum Property & Construction · Varanasi, UP</p>
            <div style={{display:'flex',gap:8}}>
              {['📷','👍','🐦','▶️'].map((icon,i)=><a key={i} href="#" style={{width:30,height:30,borderRadius:'50%',border:'1px solid rgba(245,240,234,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,textDecoration:'none',opacity:.55}}>{icon}</a>)}
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

function Card({p}:{p:any}) {
  const price = p.price>=10000000?`₹${(p.price/10000000).toFixed(1)} Cr`:p.price>=100000?`₹${(p.price/100000).toFixed(1)} L`:`₹${p.price?.toLocaleString('en-IN')}`
  return (
    <a href={`/properties/${p.id}`} style={{display:'block',textDecoration:'none',background:'rgba(255,255,255,0.04)',backdropFilter:'blur(16px)',border:'1px solid rgba(245,240,234,0.08)',borderRadius:16,overflow:'hidden'}}>
      <div style={{height:200,background:'#1a1208',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3.5rem',position:'relative',overflow:'hidden'}}>
        {p.primary_image_url?<img src={p.primary_image_url} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}} />:'🏡'}
        {p.is_featured&&<span style={{position:'absolute',top:12,left:12,fontSize:'0.62rem',fontWeight:500,letterSpacing:'0.08em',textTransform:'uppercase',padding:'4px 10px',borderRadius:20,background:'rgba(212,164,76,0.9)',color:'#1a1208'}}>★ Featured</span>}
      </div>
      <div style={{padding:18}}>
        <div style={{fontSize:'0.6rem',color:'rgba(245,240,234,0.35)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>{p.property_type}</div>
        <div style={{fontFamily:'Georgia,serif',fontSize:'1rem',color:'#F5F0EA',marginBottom:6,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.title}</div>
        <div style={{fontSize:'0.76rem',color:'rgba(245,240,234,0.35)',marginBottom:12}}>📍 {p.city}{p.state?`, ${p.state}`:''}</div>
        <div style={{fontSize:'1.25rem',fontFamily:'Georgia,serif',fontWeight:300,color:'#C8762A',marginBottom:12}}>{price}</div>
        <div style={{display:'flex',gap:14,paddingTop:10,borderTop:'1px solid rgba(245,240,234,0.06)',fontSize:'0.72rem',color:'rgba(245,240,234,0.4)'}}>
          {p.area_sqft&&<span><strong style={{color:'rgba(245,240,234,0.65)'}}>{p.area_sqft}</strong> sqft</span>}
          {p.bedrooms&&<span><strong style={{color:'rgba(245,240,234,0.65)'}}>{p.bedrooms}</strong> bed</span>}
          {p.bathrooms&&<span><strong style={{color:'rgba(245,240,234,0.65)'}}>{p.bathrooms}</strong> bath</span>}
        </div>
      </div>
    </a>
  )
}
