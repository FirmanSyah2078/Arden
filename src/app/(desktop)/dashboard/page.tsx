"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
// Import disisakan sesuai kebutuhan layout Anda saat ini
// (Card, Sparkles, dll dihapus dari import jika memang belum dipakai agar tidak warning)

export default function HomePage() {
  // --- LOGIKA ANIMASI TYPEWRITER ---
  const [typedText, setTypedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const fullText = "Welcome back, Antara.";

  useEffect(() => {
    let currentIndex = 0;
    
    // 1. Animasi Mengetik
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTypingDone(true);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    // 2. Kursor Lenyap (Setelah ketikan selesai, kedip sebentar lalu hilang)
    if (isTypingDone) {
      const timeout = setTimeout(() => {
        setCursorVisible(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isTypingDone]);

  return (
    // WRAPPER UTAMA: Mengikuti standar halaman Class
    // Hapus font-jakarta dari global wrapper agar tidak memaksa font ke semua elemen ke depannya
    <div className="flex flex-1 flex-col gap-6 p-4 bg-background selection:bg-white/20">
      
      <main className="flex-1 w-full pb-8">
        
        {/* --- 1. BANNER SECTION --- */}
        {/* mb-20 memberikan ruang lebih untuk profile yang diturunkan */}
        <div className="relative w-full mb-20">
          
          {/* BANNER UTAMA: Fix h-30 (120px) */}
          <div className="relative w-full h-30 overflow-hidden rounded-xl shadow-sm shrink-0 group">
            <Image
              src="/baner.png"
              alt="Dashboard Banner"
              fill
              priority
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105" 
            />
            {/* Menggunakan syntax Tailwind v4 bg-linear-to-r milik Anda */}
            <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/20 to-transparent" />
          </div>

          {/* PROFILE & GREETING AREA */}
          {/* Posisi Profile diturunkan: -bottom-12.5 agar tindihan ke banner pas ~20% */}
          <div className="absolute left-8 md:left-12 -bottom-12.5 flex items-end gap-6">
            
            {/* LINGKARAN PROFILE: Diperkecil ke size-20 (mobile) / size-24 (desktop) */}
            <div className="relative size-20 md:size-24 rounded-full border-[3px] border-background bg-card shadow-2xl overflow-hidden shrink-0 z-10">
              <Image
                src="/photo.jpg" 
                alt="Profile Antara"
                fill
                className="object-cover"
              />
            </div>

            {/* TEXT SAPAAN */}
            <div className="mb-3 z-10">
              {/* PENYESUAIAN FONT: font-jakarta untuk Judul Utama */}
              <h1 className="font-jakarta text-xl md:text-2xl font-bold text-foreground tracking-tight flex items-center min-h-8">
                {typedText}
                {/* KURSOR SUPER RAMPING (1px) */}
                <span 
                  className={`inline-block w-px h-5 md:h-7 ml-2 bg-primary transition-opacity duration-500 ${
                    cursorVisible ? "animate-pulse opacity-100" : "opacity-0"
                  }`} 
                />
              </h1>

              {/* PENYESUAIAN FONT: font-inter untuk Subtitle agar lebih mudah dibaca (clean) */}
              <p className="font-inter text-[9px] md:text-[12px] font-semibold text-muted-foreground mt-0.5 opacity-50">
                Administrator System
              </p>
            </div>

          </div>
        </div>


      </main>

    </div>
  );
}