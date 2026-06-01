import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const DEV_PASSWORD = '12345678'

export async function POST(request: Request) {
  const body = await request.json()
  const email = typeof body.email === 'string' ? body.email.toLowerCase().trim() : ''
  const configuredDevEmail = (
    process.env.DEV_EMAIL || process.env.NEXT_PUBLIC_DEV_EMAIL || ''
  ).toLowerCase().trim()

  if (!configuredDevEmail) {
    return NextResponse.json({ error: 'Dev email is not configured' }, { status: 500 })
  }

  if (email !== configuredDevEmail) {
    return NextResponse.json({ error: 'Unauthorized email' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data: usersResponse, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 })
  }

  const user = usersResponse.users.find(
    (candidate) => candidate.email?.toLowerCase().trim() === configuredDevEmail
  )

  if (user) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: DEV_PASSWORD,
    })

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, action: 'updated' })
  }

  const { error: createError } = await supabase.auth.admin.createUser({
    email: configuredDevEmail,
    password: DEV_PASSWORD,
    email_confirm: true,
  })

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, action: 'created' })
}
