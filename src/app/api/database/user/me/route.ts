import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { UserService } from "@/logic/dashboard/database/user.service"
import { jwtVerify } from "jose"

const SECRET_KEY = process.env.JWT_SECRET || 'rahasia-kita'
const secret = new TextEncoder().encode(SECRET_KEY)

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ status: "fail", message: "Unauthorized" }, { status: 401 })
    }

    // 🔥 BONGKAR TOKEN: Mengambil username asli (seperti 'alisasafina') dari dalam Token
    const { payload } = await jwtVerify(token, secret)
    const exactUsername = payload.username as string

    // Cari ke database menggunakan username asli
    const data = await UserService.getMe(exactUsername);
    return NextResponse.json({ status: "success", data })
    
  } catch (err: any) {
    return NextResponse.json({ status: "fail", message: err.message }, { status: 404 })
  }
}