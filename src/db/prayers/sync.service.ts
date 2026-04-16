// src/db/prayers/sync.service.ts

import { prisma } from "@/lib/prisma";
import { PrayerCacheData } from "@/types/api";

export async function getTodayPrayerCache(dateStr: string): Promise<PrayerCacheData | null> {
  const cache = await prisma.tbl_prayers.findUnique({
    where: { date: new Date(dateStr) },
  });

  if (!cache) return null;

  return {
    date: dateStr,
    fajr: cache.fajr,
    dhuhr: cache.dhuhr,
    asr: cache.asr,
    maghrib: cache.maghrib,
    isha: cache.isha,
  };
}

export async function upsertTodayPrayerCache(data: PrayerCacheData) {
  const targetDate = new Date(data.date);

  return await prisma.tbl_prayers.upsert({
    where: { date: targetDate },
    update: {
      fajr: data.fajr,
      dhuhr: data.dhuhr,
      asr: data.asr,
      maghrib: data.maghrib,
      isha: data.isha,
      updated_at: new Date(),
    },
    create: {
      date: targetDate,
      fajr: data.fajr,
      dhuhr: data.dhuhr,
      asr: data.asr,
      maghrib: data.maghrib,
      isha: data.isha,
    },
  });
}

export async function copyYesterdayToToday(todayStr: string): Promise<PrayerCacheData> {
  const todayDate = new Date(todayStr);
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1); // Mundur 1 hari

  // 1. Cari data kemarin
  const yesterdayCache = await prisma.tbl_prayers.findUnique({
    where: { date: yesterdayDate },
  });

  if (!yesterdayCache) {
    throw new Error("Yesterday's attendance data was not found.");
  }

  // 2. Duplikasi data kemarin untuk hari ini
  const result = await prisma.tbl_prayers.upsert({
    where: { date: todayDate },
    update: {
      fajr: yesterdayCache.fajr,
      dhuhr: yesterdayCache.dhuhr,
      asr: yesterdayCache.asr,
      maghrib: yesterdayCache.maghrib,
      isha: yesterdayCache.isha,
      updated_at: new Date(),
    },
    create: {
      date: todayDate,
      fajr: yesterdayCache.fajr,
      dhuhr: yesterdayCache.dhuhr,
      asr: yesterdayCache.asr,
      maghrib: yesterdayCache.maghrib,
      isha: yesterdayCache.isha,
    },
  });

  // 🔥 PERBAIKAN: Format ulang hasil return agar tidak membawa BigInt (id_cache)
  return {
    date: todayStr,
    fajr: result.fajr,
    dhuhr: result.dhuhr,
    asr: result.asr,
    maghrib: result.maghrib,
    isha: result.isha,
  };
}