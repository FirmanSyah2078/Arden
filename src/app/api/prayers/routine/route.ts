// src/app/api/prayers/routine/route.ts
import { NextResponse } from "next/server";
import { RoutineService } from "@/db/prayers/routine.service";
import { ApiSuccess, ApiFail } from "@/types/api";

export async function GET() {
  try {
    const routines = await RoutineService.getRoutine();
    return NextResponse.json(new ApiSuccess("Routine retrieved", routines));
  } catch (error: any) {
    return NextResponse.json(new ApiFail("Failed to retrieve routine", error.message), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); 
    const updated = await RoutineService.updateRoutine(body);
    return NextResponse.json(new ApiSuccess("Weekly routines saved successfully", updated));
  } catch (error: any) {
    return NextResponse.json(new ApiFail("Failed to save routine", error.message), { status: 500 });
  }
}