import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getServerProfile } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const { role } = await request.json()
  const profile = await getServerProfile()
  if (!profile) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  await admin.from('profiles').update({ role }).eq('id', profile.id)
  return NextResponse.json({ ok: true })
}
