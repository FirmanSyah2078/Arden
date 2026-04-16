import { NextResponse } from "next/server";
import { copyYesterdayToToday } from "@/db/prayers/sync.service";
import { ApiSuccess, ApiFail } from "@/types/api";

export async function POST() {
  try {
    const now = new Date();
    const dbDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const copiedData = await copyYesterdayToToday(dbDateStr);
    return NextResponse.json(new ApiSuccess("Fallback copied successfully", copiedData));
  } catch (error: any) {
    return NextResponse.json(new ApiFail(error.message, error.message), { status: 404 });
  }
}