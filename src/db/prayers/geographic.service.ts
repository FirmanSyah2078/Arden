// src/db/settings/geographic.service.ts
import { prisma } from "@/lib/prisma";
import { GeographicSettingsData } from "@/types/api";

export class GeographicService {
  // --- 1. GET DATA (Auto-Seed jika kosong) ---
  static async getGeographic() {
    let settings = await prisma.tbl_geographic.findFirst();

    // 🔥 AUTO-SEED (SELF-HEALING): 
    // Jika tabel kosong melompong, sistem otomatis membuatkan 1 baris default
    if (!settings) {
      settings = await prisma.tbl_geographic.create({
        data: {
          id_setting: 1,
          country: "Indonesia",
          city: "Kota Blitar / Jawa Timur",
          timezone: "Asia/Jakarta",
          method: "20",
          is_api_active: true,
        }
      });
    }

    return settings;
  }

  // --- 2. UPDATE DATA (Upsert) ---
  static async updateGeographic(data: Partial<GeographicSettingsData>) {
    const updateData: any = {};

    // Cek data apa saja yang dikirim dari Frontend
    if (data.is_api_active !== undefined) updateData.is_api_active = data.is_api_active;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.timezone !== undefined) updateData.timezone = data.timezone;
    if (data.method !== undefined) updateData.method = data.method;

    // 🔥 GUNAKAN UPSERT: 
    // Kalau baris id_setting: 1 ada -> Update. Kalau belum ada -> Create baru.
    const updated = await prisma.tbl_geographic.upsert({
      where: { id_setting: 1 },
      update: updateData,
      create: {
        id_setting: 1,
        country: data.country ?? "Indonesia",
        city: data.city ?? "Kota Blitar / Jawa Timur",
        timezone: data.timezone ?? "Asia/Jakarta",
        method: data.method ?? "20",
        is_api_active: data.is_api_active ?? true,
      }
    });

    return updated;
  }
}