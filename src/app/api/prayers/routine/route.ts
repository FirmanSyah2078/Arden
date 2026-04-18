import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiSuccess, ApiFail } from "@/types/api";

export async function GET() {
  try {
    let routines = await prisma.tbl_routine.findMany();
    
    // 🔥 PERBAIKAN: Jika tabel kosong, masukkan settingan awal (Senin-Jumat, Dzuhur-Ashar)
    if (routines.length === 0) {
      const defaultData = [
        { day_name: "Monday", is_active: true, track_fajr: false, track_dhuhr: true, track_asr: true, track_maghrib: false, track_isha: false },
        { day_name: "Tuesday", is_active: true, track_fajr: false, track_dhuhr: true, track_asr: true, track_maghrib: false, track_isha: false },
        { day_name: "Wednesday", is_active: true, track_fajr: false, track_dhuhr: true, track_asr: true, track_maghrib: false, track_isha: false },
        { day_name: "Thursday", is_active: true, track_fajr: false, track_dhuhr: true, track_asr: true, track_maghrib: false, track_isha: false },
        { day_name: "Friday", is_active: true, track_fajr: false, track_dhuhr: true, track_asr: false, track_maghrib: false, track_isha: false },
        { day_name: "Saturday", is_active: false, track_fajr: false, track_dhuhr: false, track_asr: false, track_maghrib: false, track_isha: false },
        { day_name: "Sunday", is_active: false, track_fajr: false, track_dhuhr: false, track_asr: false, track_maghrib: false, track_isha: false },
      ];

      await prisma.tbl_routine.createMany({ data: defaultData });
      routines = await prisma.tbl_routine.findMany();
    }

    return NextResponse.json(new ApiSuccess("Routine retrieved", routines));
  } catch (error: any) {
    return NextResponse.json(new ApiFail("Failed to retrieve routine", error.message), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); 

    const updates = body.map((schedule: any) => {
      return prisma.tbl_routine.upsert({
        where: { day_name: schedule.day },
        update: {
          is_active: schedule.isActive,
          track_fajr: schedule.trackedPrayers.includes('Fajr'),
          track_dhuhr: schedule.trackedPrayers.includes('Dhuhr'),
          track_asr: schedule.trackedPrayers.includes('Asr'),
          track_maghrib: schedule.trackedPrayers.includes('Maghrib'),
          track_isha: schedule.trackedPrayers.includes('Isha'),
        },
        create: {
          day_name: schedule.day,
          is_active: schedule.isActive,
          track_fajr: schedule.trackedPrayers.includes('Fajr'),
          track_dhuhr: schedule.trackedPrayers.includes('Dhuhr'),
          track_asr: schedule.trackedPrayers.includes('Asr'),
          track_maghrib: schedule.trackedPrayers.includes('Maghrib'),
          track_isha: schedule.trackedPrayers.includes('Isha'),
        }
      });
    });

    await prisma.$transaction(updates);
    return NextResponse.json(new ApiSuccess("Weekly routines saved successfully", body));
  } catch (error: any) {
    return NextResponse.json(new ApiFail("Failed to save routine", error.message), { status: 500 });
  }
}