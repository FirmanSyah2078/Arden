import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { prisma } from '@/lib/prisma'

const SECRET_KEY = process.env.JWT_SECRET || 'rahasia-kita'
const secret = new TextEncoder().encode(SECRET_KEY)

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  // 🔥 1. UBAH STATUS JADI OFFLINE DI DATABASE DULU
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret)
      const exactUsername = payload.username as string
      
      await prisma.tbl_users.update({
        where: { username: exactUsername },
        data: { is_online: false }
      })
    } catch (e) {
      // Jika token expired/rusak, abaikan saja dan lanjut proses logout
      console.error("Gagal update offline status:", e)
    }
  }

  // 🔥 2. BARU HAPUS COOKIES DI BROWSER
  cookieStore.delete('user_role')
  cookieStore.delete('auth_token')
  cookieStore.delete('user_name')
  cookieStore.delete('user_photo')
  cookieStore.delete('user_username')

  return NextResponse.json({ status: 'success', message: 'Berhasil logout' })
}