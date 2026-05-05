// src/app/api/prayers/geographic/route.ts
import { NextResponse } from "next/server";
import { GeographicService } from "@/db/prayers/geographic.service";
import { ApiSuccess, ApiFail } from "@/types/api";

export async function GET() {
  try {
    const settings = await GeographicService.getGeographic();
    return NextResponse.json(new ApiSuccess("Settings retrieved", settings));
  } catch (error: any) {
    return NextResponse.json(new ApiFail("Failed to retrieve settings", error.message), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = await GeographicService.updateGeographic(body);
    return NextResponse.json(new ApiSuccess("Geographic settings updated", updated));
  } catch (error: any) {
    return NextResponse.json(new ApiFail("Failed to update status", error.message), { status: 500 });
  }
}