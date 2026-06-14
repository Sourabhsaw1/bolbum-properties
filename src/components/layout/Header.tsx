'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/browser'

const DASH: Record<string, string> = {
  admin: '/dashboard/admin', seller: '/dashboard/seller',
  buyer: '/dashboard/buyer', user: '/dashboard/user',
}

interface NavItem {
  href: string
  label: string
  match: (path: string, type: string | null) => boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/properties', label: 'Browse', match: (p, t) => p === '/properties' && !t },
  { href: '/properties?type=house', label: 'Houses', match: (p, t) => p === '/properties' && t === 'house' },
  { href: '/properties?type=flat', label: 'Flats', match: (p, t) => p === '/properties' && t === 'flat' },
  { href: '/properties?type=plot', label: 'Plots', match: (p, t) => p === '/properties' && t === 'plot' },
  { href: '/services', label: 'Services', match: (p) => p === '/services' },
]

function HeaderSkeleton() {
  return (
    <>
      <div className="shimmer-line" style={{ position:'fixed', top:0, left:0, right:0, zIndex:100 }} />
      <header>
        <div className="logo" style={{ gap:0 }}>
          <img src="/logo.png" alt="Bol Bum Property" style={{ height:48, width:48, objectFit:'contain', marginRight:8 }} />
          <span style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:'1rem', color:'var(--white)' }}>
            Bol Bum <span style={{ color:'var(--orange)' }}>Property</span>
          </span>
        </div>
        <nav className="desktop-nav">
          {NAV_ITEMS.map(item => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-right">
          <div style={{ width:80, height:32, background:'var(--gray-2)', borderRadius:8, opacity:0.5 }} />
        </div>
      </header>
    </>
  )
}

function HeaderInner() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const loadedRef = useRef(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentType = searchParams.get('type')

  useEffect(() => {
    const supabase = getSupabaseBrowser()

    // Safety: force loading=false after 3s max so we never show a stuck skeleton
    const timer = setTimeout(() => {
      if (!loadedRef.current) {
        loadedRef.current = true
        setLoading(false)
      }
    }, 3000)

    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setProfile(null)
          return
        }
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data || null)
      } catch (err) {
        console.error('Header: profile fetch failed:', err)
        setProfile(null)
      } finally {
        loadedRef.current = true
        setLoading(false)
      }
    }

    getProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getProfile()
      } else {
        setProfile(null)
        loadedRef.current = true
        setLoading(false)
      }
    })

    return () => {
      clearTimeout(timer)
      subscription.unsubscribe()
    }
  }, [])

  const dashLink = profile ? (DASH[profile.role] ?? '/dashboard/user') : null

  const activeStyle: React.CSSProperties = {
    color: 'var(--orange)',
    position: 'relative',
  }

  return (
    <>
      <div className="shimmer-line" style={{ position:'fixed', top:0, left:0, right:0, zIndex:100 }} />
      <header>
        <a href="/" className="logo" style={{ gap:0 }}>
          <img src="/logo.png" alt="Bol Bum Property" style={{ height:48, width:48, objectFit:'contain', marginRight:8 }} />
          <span style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:'1rem', color:'var(--white)' }}>
            Bol Bum <span style={{ color:'var(--orange)' }}>Property</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          {NAV_ITEMS.map(item => {
            const isActive = item.match(pathname, currentType)
            return (
              <a
                key={item.label}
                href={item.href}
                className={isActive ? 'nav-active' : ''}
                style={isActive ? activeStyle : undefined}
              >
                {item.label}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: -2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: 2,
                    background: 'var(--orange)',
                    borderRadius: 2,
                    boxShadow: '0 0 8px rgba(255,107,26,0.6)',
                  }} />
                )}
              </a>
            )
          })}
        </nav>

        {/* Right side auth buttons */}
        <div className="header-right">
          {loading ? (
            <div style={{ width:80, height:32, background:'var(--gray-2)', borderRadius:8, opacity:0.5 }} />
          ) : profile ? (
            <>
              <a href={dashLink!} className="btn-primary btn-sm">
                {profile.role === 'admin'  ? '👑 Admin'     :
                 profile.role === 'seller' ? '🏘️ Dashboard' :
                 profile.role === 'buyer'  ? '🛒 Dashboard' : '👤 Dashboard'}
              </a>
              <button className="btn-ghost btn-sm" onClick={async () => {
                await getSupabaseBrowser().auth.signOut()
                window.location.href = '/'
              }}>Sign out</button>
            </>
          ) : (
            <>
              <a href="/auth/login"  className="btn-ghost btn-sm">Sign In</a>
              <a href="/auth/signup" className="btn-primary btn-sm">Get Started</a>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--white)',
              fontSize: '1.4rem',
              padding: '6px',
              marginLeft: 4,
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu overlay */}
        {menuOpen && (
          <div className="mobile-menu">
            {NAV_ITEMS.map(item => {
              const isActive = item.match(pathname, currentType)
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={isActive ? { color: 'var(--orange)', fontWeight: 600, borderLeft: '3px solid var(--orange)', paddingLeft: 12 } : undefined}
                >
                  {item.label}
                </a>
              )
            })}
          </div>
        )}
      </header>
    </>
  )
}

export default function Header() {
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <HeaderInner />
    </Suspense>
  )
}
