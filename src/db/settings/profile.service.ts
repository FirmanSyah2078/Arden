import { prisma } from "@/lib/prisma"

export class ProfileService {
  // --- UPDATE MY PROFILE ---
  static async updateMyProfile(id: number, data: { name?: string; username?: string; photo_url?: string }) { // 🔥 FIX: foto_url -> photo_url
    try {
      const currentUser = await prisma.tbl_users.findUnique({
        where: { id_user: id }, 
        select: { id_user: true, username: true }
      });

      if (!currentUser) throw new Error("User not found");

      if (data.username && data.username !== currentUser.username) {
        const existing = await prisma.tbl_users.findUnique({ where: { username: data.username } });
        if (existing) throw new Error("Username is already taken!");
      }

      const updatedUser = await prisma.tbl_users.update({
        where: { id_user: currentUser.id_user },
        data: {
          name: data.name, 
          username: data.username,
          photo_url: data.photo_url // 🔥 FIX
        },
        select: {
          id_user: true,
          name: true, 
          username: true,
          photo_url: true, // 🔥 FIX
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