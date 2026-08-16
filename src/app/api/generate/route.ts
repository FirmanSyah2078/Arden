import { NextResponse } from "next/server";
import { GenerateService } from "@/db/structure/generate.service";
import {
  ApiSuccess,
  ApiFail,
  GeneratorSettingsData,
} from "@/types/api";

export async function GET() {
  try {
    const settings = await GenerateService.getGenerate();

    return NextResponse.json(
      new ApiSuccess(
        "Generator settings retrieved",
        settings
      )
    );
  } catch (error: unknown) {
    console.error("[GET /api/generate]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GeneratorSettingsData;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        new ApiFail(
          "Invalid Payload",
          "Request body must be an object"
        ),
        { status: 400 }
      );
    }

    if (!body.qrColor) {
      return NextResponse.json(
        new ApiFail(
          "Invalid Payload",
          "Missing required field: qrColor"
        ),
        { status: 400 }
      );
    }

    await GenerateService.updateGenerate(body);

    return NextResponse.json(
      new ApiSuccess(
        "Generator engine updated successfully",
        body
      )
    );
  } catch (error: unknown) {
    console.error("[POST /api/generate]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}