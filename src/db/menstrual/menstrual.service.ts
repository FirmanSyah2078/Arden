// src/db/menstrual/menstrual.service.ts
import { PeriodSettingsData } from "@/types/api";
import { prisma } from "@/lib/prisma"; 

export async function getPeriodSettings(): Promise<PeriodSettingsData | null> {
  const setting = await prisma.tbl_menstruation_settings.findFirst();
  if (!setting) return null;
  return {
    minDuration: setting.min_duration ?? 5,
    standardDuration: setting.standard_duration ?? 7,
    maxDuration: setting.max_duration ?? 10,
    overLimit: setting.over_limit ?? 30,
  };
}

export async function upsertPeriodSettings(data: PeriodSettingsData) {
  const existingSetting = await prisma.tbl_menstruation_settings.findFirst();
  if (existingSetting) {
    return await prisma.tbl_menstruation_settings.update({
      where: { id_setting: existingSetting.id_setting },
      data: {
        min_duration: data.minDuration,
        standard_duration: data.standardDuration,
        max_duration: data.maxDuration,
        over_limit: data.overLimit,
      },
    });
  } else {
    return await prisma.tbl_menstruation_settings.create({
      data: {
        min_duration: data.minDuration,
        standard_duration: data.standardDuration,
        max_duration: data.maxDuration,
        over_limit: data.overLimit,
      },
    });
  }
}