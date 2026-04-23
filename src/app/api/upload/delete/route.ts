import { createClient } from '@/lib/supabase/server'
import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  })

  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { imageUrl } = await request.json()
  if (!imageUrl) return NextResponse.json({ error: 'No URL' }, { status: 400 })

  try {
    // Extract public_id from Cloudinary URL
    // Format: .../upload/v12345/folder/id.jpg
    const parts = imageUrl.split('/')
    const fileName = parts[parts.length - 1].split('.')[0]
    const folder = parts[parts.length - 2]
    const publicId = `ilaara/products/${fileName}`

    const result = await cloudinary.uploader.destroy(publicId)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
