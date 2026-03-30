import { prisma } from "@/lib/prisma"

export class ProfileService {
  // --- UPDATE MY PROFILE ---
  // 🔥 FIX: Ubah parameter menjadi id: number (bukan exactUsername: string lagi)
  static async updateMyProfile(id: number, data: { name?: string; username?: string; foto_url?: string }) {
    try {
      // 1. Cari user berdasarkan ID (Pasti Ketemu & Super Aman!)
      const currentUser = await prisma.tbl_users.findUnique({
        where: { id_user: id }, // Sekarang 'id'-nya sudah dikenali!
        select: { id_user: true, username: true }
      });

      if (!currentUser) throw new Error("User tidak ditemukan");

      // 2. Jika user mencoba ganti username, cek apakah bentrok dengan orang lain
      if (data.username && data.username !== currentUser.username) {
        const existing = await prisma.tbl_users.findUnique({ where: { username: data.username } });
        if (existing) throw new Error("Username sudah dipakai oleh pengguna lain!");
      }

      // 3. Update data
      const updatedUser = await prisma.tbl_users.update({
        where: { id_user: currentUser.id_user },
        data: {
          name: data.name, 
          username: data.username,
          foto_url: data.foto_url
        },
        select: {
          id_user: true,
          name: true, 
          username: true,
          foto_url: true,
          role: true,
          last_login: true,
          created_at: true 
        }
      });

      return { ...updatedUser, id_user: Number(updatedUser.id_user) };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}