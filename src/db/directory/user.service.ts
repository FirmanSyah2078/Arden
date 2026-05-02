// src/db/directory/user.service.ts
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export class UserService {
  // --- 1. GET ALL USERS ---
  static async getAllUsers() {
    const users = await prisma.tbl_users.findMany({
      select: {
        id_user: true,
        name: true,
        username: true,
        role: true,
        photo_url: true, 
        last_login: true,
        is_active: true,
        is_online: true,
        created_at: true,
      },
      orderBy: { id_user: 'asc' }
    });

    return users.map(u => ({ ...u, id_user: Number(u.id_user) }));
  }

  // --- 2. GET CURRENT USER (ME) ---
  static async getMe(id: number) { 
    const user = await prisma.tbl_users.findUnique({
      where: { id_user: id },
      select: {
        id_user: true,
        name: true,
        username: true,
        role: true,
        last_login: true,
        photo_url: true, 
        created_at: true 
      }
    });

    // 🔥 Diubah ke bahasa Inggris profesional
    if (!user) throw new Error("User not found.");
    
    return { ...user, id_user: Number(user.id_user) };
  }

  // --- 3. CREATE USER ---
  static async createUser(data: any) {
    const existing = await prisma.tbl_users.findUnique({ where: { username: data.username } });
    
    // 🔥 Pesan Error Dinamis & Profesional
    if (existing) {
      throw new Error(`Registration failed: Username '${data.username}' is already taken.`);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.tbl_users.create({
      data: {
        name: data.name,
        username: data.username,
        password: hashedPassword,
        role: data.role || 'Pelaksana',
        is_active: true, 
      }
    });

    const { password, ...safeUser } = newUser;
    return { ...safeUser, id_user: Number(safeUser.id_user) };
  }

  // --- 4. UPDATE USER ---
  static async updateUser(id: number, data: any) {
    const payload: any = {};
    if (data.name) payload.name = data.name;
    if (data.role) payload.role = data.role;
    
    if (data.username) {
      const existingUser = await prisma.tbl_users.findUnique({ 
        where: { username: data.username } 
      });
      
      // 🔥 Pesan Error Dinamis & Profesional untuk Update
      if (existingUser && existingUser.id_user !== BigInt(id)) {
        throw new Error(`Update failed: Username '${data.username}' is already in use by another account.`);
      }
      
      payload.username = data.username;
    }

    if (data.is_active !== undefined) {
      payload.is_active = String(data.is_active) === 'true';
    }

    const updated = await prisma.tbl_users.update({
      where: { id_user: id },
      data: payload
    });

    const { password, ...safeUser } = updated;
    return { ...safeUser, id_user: Number(safeUser.id_user) };
  }

  // --- 5. DELETE USER ---
  static async deleteUser(id: number) {
    await prisma.tbl_users.delete({ where: { id_user: id } });
    return true;
  }

  // --- 6. RESET PASSWORD ---
  static async resetPassword(id: number, newPasswordPlain: string) {
    // 🔥 Diubah ke bahasa Inggris profesional
    if (newPasswordPlain.length < 6) {
      throw new Error("Reset failed: Password must be at least 6 characters long.");
    }
    
    const hashedPassword = await bcrypt.hash(newPasswordPlain, 10);
    
    await prisma.tbl_users.update({
      where: { id_user: id },
      data: { password: hashedPassword }
    });
    
    return true;
  }
}