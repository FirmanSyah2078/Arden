// src/db/prayers/routine.service.ts
import { prisma } from "@/lib/prisma";
import { DayScheduleData } from "@/types/api";

export class RoutineService {
  static async getRoutine() {
    let routines = await prisma.tbl_routine.findMany();
    
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
    return routines;
  }

  static async updateRoutine(schedules: DayScheduleData[]) {
    const updates = schedules.map((schedule) => {
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
    return schedules;
  }
}