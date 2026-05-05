// src/db/menstrual/menstrual.service.ts
import { PeriodSettingsData } from "@/types/api";
import { prisma } from "@/lib/prisma"; 

export async function getPeriodSettings(): Promise<PeriodSettingsData | null> {
  const setting = await prisma.tbl_menstruation_settings.findFirst();
  if (!setting) return null;
  
  // 🔥 FIX: Mapping diubah mutlak ke snake_case sesuai api.ts
  return {
    min_duration: setting.min_duration ?? 5,
    standard_duration: setting.standard_duration ?? 7,
    max_duration: setting.max_duration ?? 10,
    over_limit: setting.over_limit ?? 30,
  };
}

export async function upsertPeriodSettings(data: PeriodSettingsData) {
  const existingSetting = await prisma.tbl_menstruation_settings.findFirst();
  
  const payload = {
    min_duration: data.min_duration,
    standard_duration: data.standard_duration,
    max_duration: data.max_duration,
    over_limit: data.over_limit,
  };

  if (existingSetting) {
    return await prisma.tbl_menstruation_settings.update({
      where: { id_setting: existingSetting.id_setting },
      data: payload,
    });
  } else {
    return await prisma.tbl_menstruation_settings.create({
      data: payload,
    });
  }
}