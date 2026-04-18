// src/app/api/prayers/geographic/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiSuccess, ApiFail } from "@/types/api";

export async function GET() {
  try {
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

    return NextResponse.json(new ApiSuccess("Settings retrieved", settings));
  } catch (error: any) {
    return NextResponse.json(new ApiFail("Failed to retrieve settings", error.message), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updateData: any = {};

    // Cek data apa saja yang dikirim dari Frontend
    if (body.is_api_active !== undefined) updateData.is_api_active = body.is_api_active;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.country !== undefined) updateData.country = body.country;
    if (body.timezone !== undefined) updateData.timezone = body.timezone;
    if (body.method !== undefined) updateData.method = body.method;

    // 🔥 GUNAKAN UPSERT: 
    // Kalau baris id_setting: 1 ada -> Update. Kalau belum ada -> Create baru.
    // Dijamin 100% bebas dari error RecordNotFound!
    const updated = await prisma.tbl_geographic.upsert({
      where: { id_setting: 1 },
      update: updateData,
      create: {
        id_setting: 1,
        country: body.country ?? "Indonesia",
        city: body.city ?? "Kota Blitar / Jawa Timur",
        timezone: body.timezone ?? "Asia/Jakarta",
        method: body.method ?? "20",
        is_api_active: body.is_api_active ?? true,
      }
    });
    
    return NextResponse.json(new ApiSuccess("Geographic settings updated", updated));
  } catch (error: any) {
    return NextResponse.json(new ApiFail("Failed to update status", error.message), { status: 500 });
  }
}