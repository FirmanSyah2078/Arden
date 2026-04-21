"use client"

import Image from "next/image"

export function DashboardBanner() {
  return (
    // CONTAINER UTAMA
    // h-[149px] : Tinggi fix sesuai Figma
    // w-full    : Lebar fleksibel
    // relative  : Agar gambar di dalamnya bisa 'fill' container ini
    <div className="relative w-full h-30 overflow-hidden rounded-xl shadow-sm">
      
      {/* 1. BACKGROUND IMAGE */}
      {/* Menggunakan Next.js Image agar optimasi performa bagus */}
      <Image
        src="/baner.png"      // Pastikan file banner.png ada di folder 'public'
        alt="Dashboard Banner"
        fill                   // Membuat gambar memenuhi container (absolute inset-0)
        priority               // Dimuat duluan karena ini elemen utama (LCP)
        className="object-cover object-center" // Style CSS: Cover & Rata Tengah
      />

      {/* 2. OVERLAY (Opsional tapi Penting) */}
      {/* Layer hitam transparan tipis agar tulisan putih tetap terbaca walau gambarnya terang */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  )
}