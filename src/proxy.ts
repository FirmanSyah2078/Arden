import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
  const userRole = req.cookies.get('user_role')?.value
  const url = req.nextUrl.pathname

  // 1. PROTEKSI DASHBOARD & SETTINGS (Admin & Pemantau)
  if (url.startsWith('/dashboard') || url.startsWith('/settings')) {
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // Jika Pelaksana mencoba masuk Dashboard -> Tendang ke /go
    if (userRole === 'Pelaksana') {
      return NextResponse.redirect(new URL('/go', req.url)) 
    }
  }

  // 2. PROTEKSI MOBILE (Pelaksana)
  // 🔥 FIX: Ubah /mobile menjadi /go dan /me
  if (url.startsWith('/go') || url.startsWith('/me')) { 
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // Jika Admin iseng masuk tampilan HP -> Balikin ke Dashboard
    if (userRole === 'Admin' || userRole === 'Pemantau') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // 3. PROTEKSI HALAMAN LOGIN
  if (url.startsWith('/login') && userRole) {
    // 🔥 FIX: Tendang Pelaksana ke /go jika sudah login
    if (userRole === 'Pelaksana') {
      return NextResponse.redirect(new URL('/go', req.url)) 
    }
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next() 
}

// 🔥 FIX: Update Config Matcher
export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/go/:path*', '/me/:path*', '/login'] 
}