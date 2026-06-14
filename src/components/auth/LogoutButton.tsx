'use client'
import { getSupabaseBrowser } from '@/lib/supabase/browser'

export default function LogoutButton() {
  return (
    <button className="btn-ghost btn-sm" onClick={async () => {
      await getSupabaseBrowser().auth.signOut()
      window.location.href = '/'
    }}>
      Sign out
    </button>
  )
}
