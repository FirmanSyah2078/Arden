// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// 🔥 MANTRA SAKTI PENAKLUK BIGINT 🔥
// Ini akan memaksa Javascript mengubah semua BigInt menjadi String saat diubah ke JSON
// Sehingga tidak akan terjadi error 404/500 saat me-return NextResponse.json()
if (typeof BigInt !== "undefined") {
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
}

// Mencegah multiple instance Prisma Client saat hot-reload di mode development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 1. Ambil URL Koneksi dari .env.local (Otomatis akan membaca port 6543 Supabase)
const connectionString = process.env.DATABASE_URL;

// 2. Buat Kolam Koneksi (Pool) menggunakan paket 'pg'
const pool = new Pool({ connectionString });

// 3. Bungkus dengan Prisma Adapter
const adapter = new PrismaPg(pool);

// 4. Masukkan adapter ke dalam mesin Prisma 7
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // <-- INI KUNCI UTAMA PRISMA 7!
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;