import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // 1. Ambil data role dari Cookies (yang kita set pas Login tadi)
  const userRole = req.cookies.get('user_role')?.value
  const url = req.nextUrl.pathname

  // 2. PROTEKSI HALAMAN DASHBOARD (Wilayah Admin & Pemantau)
  if (url.startsWith('/dashboard')) {
    // Kalau belum login, tendang ke login
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // Kalau Pelaksana iseng mau masuk sini, TENDANG BALIK ke App
    if (userRole === 'Pelaksana') {
      return NextResponse.redirect(new URL('/app/home', req.url))
    }
  }

  // 3. PROTEKSI HALAMAN APP (Wilayah Pelaksana)
  if (url.startsWith('/app')) {
    // Kalau belum login, tendang ke login
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // Kalau Admin/Pemantau iseng mau masuk sini, TENDANG BALIK ke Dashboard
    if (userRole === 'Admin' || userRole === 'Pemantau') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // 4. PROTEKSI HALAMAN LOGIN (Biar gak login ulang)
  if (url.startsWith('/login') && userRole) {
    // Kalau sudah login, jangan kasih buka halaman login lagi
    if (userRole === 'Pelaksana') {
      return NextResponse.redirect(new URL('/app/home', req.url))
    } else {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
}

// Tentukan rute mana saja yang dijaga Satpam
export const config = {
  matcher: ['/dashboard/:path*', '/app/:path*', '/login'],
}