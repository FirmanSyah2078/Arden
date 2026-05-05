import { NextResponse } from "next/server";
import { getPeriodSettings, upsertPeriodSettings } from "@/db/menstrual/menstrual.service";
import { ApiSuccess, ApiFail, PeriodSettingsData } from "@/types/api";

export async function GET() {
  try {
    const settings = await getPeriodSettings();
    if (!settings) return NextResponse.json(new ApiSuccess("Settings not initialized", null));
    return NextResponse.json(new ApiSuccess("Settings retrieved successfully", settings));
  } catch (error: any) {
    return NextResponse.json(new ApiFail("Failed to retrieve settings", error.message), { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json() as PeriodSettingsData;
    
    // 🔥 FIX: Validasi disinkronkan menggunakan snake_case mutlak!
    if (!body || body.min_duration === undefined || body.standard_duration === undefined) {
      return NextResponse.json(new ApiFail("Invalid Payload", "Incomplete parameters"), { status: 400 });
    }
    
    await upsertPeriodSettings(body);
    return NextResponse.json(new ApiSuccess("Settings updated successfully", body));
  } catch (error: any) {
    return NextResponse.json(new ApiFail("Failed to update settings", error.message), { status: 500 });
  }
}