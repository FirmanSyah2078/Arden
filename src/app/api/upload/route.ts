// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 1. Inisialisasi Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    // 2. Tangkap paket FormData dari Frontend
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ status: "fail", message: "Tidak ada file yang diterima server" }, { status: 400 });
    }

    // 3. Validasi Keamanan (Hanya izinkan gambar)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ status: "fail", message: "File harus berupa gambar (JPG/PNG)" }, { status: 400 });
    }

    // 4. Ubah File fisik menjadi Buffer (Bahasa mesin yang dimengerti Supabase)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5. Buat nama file yang super unik agar tidak bentrok dengan user lain
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile-${uniqueSuffix}.${fileExtension}`;

    // 6. Terbangkan ke Supabase Storage (Bucket: 'avatars')
    const { data, error } = await supabase.storage
      .from("avatars") // 🔥 Harus persis dengan nama bucket yang kamu buat di Tahap 1
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false // Jangan timpa file yang namanya kebetulan sama
      });

    if (error) {
      throw new Error(`Gagal upload ke Supabase: ${error.message}`);
    }

    // 7. Minta URL Publik dari Supabase agar bisa ditampilkan di elemen <img>
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    // 8. Kembalikan URL Publiknya ke Frontend (Sesuai harapan use-profile.ts)
    return NextResponse.json({
      status: "success",
      message: "File berhasil diunggah",
      data: { url: publicUrlData.publicUrl }
    });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ status: "fail", message: error.message }, { status: 500 });
  }
}