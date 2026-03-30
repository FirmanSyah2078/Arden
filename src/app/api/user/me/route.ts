import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { UserService } from "@/db/dashboard/database/user.service"
import { ProfileService } from "@/db/dashboard/settings/profile.service"
import { jwtVerify } from "jose"

const SECRET_KEY = process.env.JWT_SECRET || 'rahasia-kita'
const secret = new TextEncoder().encode(SECRET_KEY)

// --- GET: Ambil Data Profil Saat Ini ---
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) return NextResponse.json({ status: "fail", message: "Unauthorized" }, { status: 401 })

    // 🔥 FIX: Ambil ID dari Token (bukan username lagi)
    const { payload } = await jwtVerify(token, secret)
    const exactId = Number(payload.id) 

    const data = await UserService.getMe(exactId);
    return NextResponse.json({ status: "success", data })
    
  } catch (err: any) {
    return NextResponse.json({ status: "fail", message: err.message }, { status: 404 })
  }
}

// --- PATCH: Simpan Perubahan Profil ---
export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) return NextResponse.json({ status: "fail", message: "Unauthorized" }, { status: 401 })

    // 🔥 FIX: Ambil ID dari Token
    const { payload } = await jwtVerify(token, secret)
    const exactId = Number(payload.id)

    const body = await req.json()

    const updatePayload = {
      name: body.name,
      username: body.username,
      foto_url: body.avatarUrl
    }
    
    // 🔥 FIX: Lempar ID ke ProfileService
    const updatedUser = await ProfileService.updateMyProfile(exactId, updatePayload)

    // Update Cookies untuk real-time UI
    const cookieOptions = { path: '/', maxAge: 86400, sameSite: 'lax' as const }
    if (updatedUser.name) cookieStore.set('user_name', updatedUser.name, cookieOptions);
    if (updatedUser.username) cookieStore.set('user_username', updatedUser.username, cookieOptions);
    if (updatedUser.foto_url) cookieStore.set('user_photo', updatedUser.foto_url, cookieOptions);

    return NextResponse.json({ status: "success", message: "Profil berhasil diperbarui", data: updatedUser })
  } catch (err: any) {
    return NextResponse.json({ status: "fail", message: err.message }, { status: 500 })
  }
}