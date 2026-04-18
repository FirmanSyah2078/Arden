// src/app/api/prayers/sync/route.ts

import { NextResponse } from "next/server";
import { getTodayPrayerCache, upsertTodayPrayerCache } from "@/db/prayers/sync.service";
import { ApiSuccess, ApiFail, PrayerCacheData } from "@/types/api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date'); // Format: YYYY-MM-DD

    if (!date) throw new Error("Date parameter is required");

    const cache = await getTodayPrayerCache(date);
    return NextResponse.json(new ApiSuccess("Cache retrieved", cache));
  } catch (error: any) {
    return NextResponse.json(new ApiFail("Failed to retrieve cache", error.message), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as PrayerCacheData;
    
    if (!body || !body.date || !body.fajr) {
      return NextResponse.json(new ApiFail("Invalid Payload", "Incomplete prayer data"), { status: 400 });
    }

    await upsertTodayPrayerCache(body);
    return NextResponse.json(new ApiSuccess("Cache updated successfully", body));
  } catch (error: any) {
    return NextResponse.json(new ApiFail("Failed to update cache", error.message), { status: 500 });
  }
}