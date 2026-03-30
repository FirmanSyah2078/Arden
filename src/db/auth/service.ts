// src/logic/auth/service.ts
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { SignJWT } from "jose"

const SECRET_KEY = process.env.JWT_SECRET || 'rahasia-kita'
const secret = new TextEncoder().encode(SECRET_KEY)

export class AuthService {
  // 1. Verifikasi User ke Database (Menggunakan Prisma)
  static async verifyCredentials(username: string, passwordPlain: string) {
    const user = await prisma.tbl_users.findUnique({ where: { username } })

    if (!user) throw new Error("Username tidak ditemukan")

    // 🔥 BLOKIR JIKA AKUN NONAKTIF/BANNED
    if (!user.is_active) {
      throw new Error("Akun Anda telah dinonaktifkan. Silakan hubungi Admin.")
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.password)
    if (!isMatch) throw new Error("Password salah")

    // 🔥 SET ONLINE SAAT LOGIN
    await prisma.tbl_users.update({
      where: { id_user: user.id_user },
      data: { last_login: new Date(), is_online: true } 
    })

    return user
  }

  // 2. Generate Token JWT
  static async generateToken(payload: { id: number; username: string; role: string }) {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h') // Berlaku 24 jam
      .sign(secret)
  }
}