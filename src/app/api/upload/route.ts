// src/app/api/upload/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";

// ============================================================
// ENVIRONMENT
// ============================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const jwtSecret = process.env.JWT_SECRET;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL belum dikonfigurasi.");
}

if (!supabaseServiceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi.");
}

if (!jwtSecret) {
  throw new Error("JWT_SECRET belum dikonfigurasi.");
}

// ============================================================
// CLIENT
// ============================================================

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);

const secret = new TextEncoder().encode(jwtSecret);

// ============================================================
// KONFIGURASI FILE
// ============================================================

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const ALLOWED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
]);

// ============================================================
// HELPER
// ============================================================

function getFileExtension(fileName: string): string {
  const parts = fileName.toLowerCase().split(".");

  if (parts.length < 2) {
    return "";
  }

  return parts.at(-1) ?? "";
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan pada server.";
}

// ============================================================
// AUTHENTICATION
// ============================================================

async function verifyAuthentication() {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (
      typeof payload.id !== "number" &&
      typeof payload.id !== "string"
    ) {
      return null;
    }

    if (typeof payload.username !== "string") {
      return null;
    }

    if (typeof payload.role !== "string") {
      return null;
    }

    return {
      id: payload.id,
      username: payload.username,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

// ============================================================
// POST — UPLOAD FILE
// ============================================================

export async function POST(req: Request) {
  try {
    // --------------------------------------------------------
    // 1. Pastikan user sudah login
    // --------------------------------------------------------

    const user = await verifyAuthentication();

    if (!user) {
      return NextResponse.json(
        {
          status: "fail",
          message: "Anda harus login terlebih dahulu.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------------
    // 2. Ambil FormData
    // --------------------------------------------------------

    const formData = await req.formData();
    const fileValue = formData.get("file");

    if (!(fileValue instanceof File)) {
      return NextResponse.json(
        {
          status: "fail",
          message: "Tidak ada file yang diterima server.",
        },
        { status: 400 }
      );
    }

    const file = fileValue;

    // --------------------------------------------------------
    // 3. Validasi ukuran
    // --------------------------------------------------------

    if (file.size <= 0) {
      return NextResponse.json(
        {
          status: "fail",
          message: "File kosong atau tidak valid.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          status: "fail",
          message: "Ukuran file terlalu besar. Maksimal 2 MB.",
        },
        { status: 413 }
      );
    }

    // --------------------------------------------------------
    // 4. Validasi MIME
    // --------------------------------------------------------

    const mimeType = file.type.toLowerCase();

    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          status: "fail",
          message:
            "Format file tidak didukung. Gunakan JPG, PNG, atau WebP.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 5. Validasi extension
    // --------------------------------------------------------

    const extension = getFileExtension(file.name);

    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json(
        {
          status: "fail",
          message:
            "Extension file tidak didukung. Gunakan JPG, PNG, atau WebP.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 6. Pastikan MIME dan extension konsisten
    // --------------------------------------------------------

    const mimeExtensionMap: Record<string, string[]> = {
      "image/jpeg": ["jpg", "jpeg"],
      "image/png": ["png"],
      "image/webp": ["webp"],
    };

    const allowedExtensionsForMime =
      mimeExtensionMap[mimeType];

    if (
      !allowedExtensionsForMime ||
      !allowedExtensionsForMime.includes(extension)
    ) {
      return NextResponse.json(
        {
          status: "fail",
          message:
            "Tipe file dan extension tidak sesuai.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 7. Generate nama file dari server
    // --------------------------------------------------------

    const uniqueId = crypto.randomUUID();

    const fileName = `profile-${uniqueId}.${extension}`;

    // --------------------------------------------------------
    // 8. File → Buffer
    // --------------------------------------------------------

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // --------------------------------------------------------
    // 9. Upload ke Supabase Storage
    // --------------------------------------------------------

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error(
        "Supabase Storage Upload Error:",
        uploadError
      );

      return NextResponse.json(
        {
          status: "fail",
          message: "Gagal menyimpan file ke Storage.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------------
    // 10. Ambil public URL
    // --------------------------------------------------------

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    if (!publicUrlData.publicUrl) {
      // Upload berhasil tetapi URL gagal.
      // Bersihkan object agar tidak meninggalkan file yatim.

      await supabase.storage
        .from("avatars")
        .remove([fileName]);

      return NextResponse.json(
        {
          status: "fail",
          message:
            "File berhasil diupload tetapi URL tidak dapat dibuat.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------------
    // 11. Response
    // --------------------------------------------------------

    return NextResponse.json({
      status: "success",
      message: "File berhasil diunggah.",
      data: {
        url: publicUrlData.publicUrl,
        user: {
          id: user.id,
          username: user.username,
        },
      },
    });
  } catch (error: unknown) {
    console.error("Upload Error:", error);

    return NextResponse.json(
      {
        status: "fail",
        message: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE — HAPUS FILE
// ============================================================

export async function DELETE(req: Request) {
  try {
    // --------------------------------------------------------
    // 1. Pastikan user sudah login
    // --------------------------------------------------------

    const user = await verifyAuthentication();

    if (!user) {
      return NextResponse.json(
        {
          status: "fail",
          message: "Anda harus login terlebih dahulu.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------------
    // 2. Ambil URL
    // --------------------------------------------------------

    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("url");

    if (!fileUrl) {
      return NextResponse.json(
        {
          status: "fail",
          message: "URL file tidak diberikan.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 3. Pastikan URL berasal dari bucket avatars
    // --------------------------------------------------------

    const expectedPrefix =
      `${supabaseUrl}/storage/v1/object/public/avatars/`;

    if (!fileUrl.startsWith(expectedPrefix)) {
      return NextResponse.json(
        {
          status: "fail",
          message: "URL file tidak valid.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 4. Ambil nama object
    // --------------------------------------------------------

    const fileName = decodeURIComponent(
      fileUrl.slice(expectedPrefix.length)
    );

    if (!fileName || fileName.includes("/")) {
      return NextResponse.json(
        {
          status: "fail",
          message: "Nama file tidak valid.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 5. Hanya izinkan object buatan sistem
    // --------------------------------------------------------

    if (!fileName.startsWith("profile-")) {
      return NextResponse.json(
        {
          status: "fail",
          message: "File tidak dapat dihapus.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------------
    // 6. Hapus dari Storage
    // --------------------------------------------------------

    const { error: deleteError } = await supabase.storage
      .from("avatars")
      .remove([fileName]);

    if (deleteError) {
      console.error(
        "Supabase Storage Delete Error:",
        deleteError
      );

      return NextResponse.json(
        {
          status: "fail",
          message: "Gagal menghapus file dari Storage.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "File lama berhasil dihapus.",
    });
  } catch (error: unknown) {
    console.error("Delete Upload Error:", error);

    return NextResponse.json(
      {
        status: "fail",
        message: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}