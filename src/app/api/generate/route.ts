import { NextResponse } from "next/server";
import { GenerateService } from "@/db/structure/generate.service";
import { ApiSuccess, ApiFail, GeneratorSettingsData } from "@/types/api";

export async function GET() {
  try {
    const settings = await GenerateService.getGenerate();
    return NextResponse.json(new ApiSuccess("Generator settings retrieved", settings));
  } catch (error: any) {
    return NextResponse.json(new ApiFail("Failed to retrieve settings", error.message), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as GeneratorSettingsData;
    
    // Validasi singkat untuk memastikan payload tidak kosong
    if (!body || !body.qrColor) {
      return NextResponse.json(new ApiFail("Invalid Payload", "Missing required fields"), { status: 400 });
    }

    await GenerateService.updateGenerate(body);
    
    // Kembalikan body agar client bisa me-refresh state-nya dengan data yang berhasil disimpan
    return NextResponse.json(new ApiSuccess("Generator engine updated successfully", body));
  } catch (error: any) {
    return NextResponse.json(new ApiFail("Failed to update engine", error.message), { status: 500 });
  }
}