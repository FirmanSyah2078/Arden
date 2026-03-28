"use client"

import { cn } from "@/lib/utils"

const diamonds = [
  // --- LAPIS 1: PALING BAWAH (Paling padat, ukuran terbesar) ---
  { size: "w-3 h-3", left: "10%", bottom: "5%", anim: "animate-diamond-1", color: "from-white to-cyan-300" },
  { size: "w-4 h-4", left: "25%", bottom: "2%", anim: "animate-diamond-2", color: "from-white to-blue-400" },
  { size: "w-2.5 h-2.5", left: "40%", bottom: "8%", anim: "animate-diamond-3", color: "from-white to-indigo-300" },
  { size: "w-3.5 h-3.5", left: "55%", bottom: "4%", anim: "animate-diamond-1", color: "from-white to-cyan-400" },
  { size: "w-3 h-3", left: "70%", bottom: "10%", anim: "animate-diamond-2", color: "from-white to-blue-300" },
  { size: "w-4 h-4", left: "85%", bottom: "6%", anim: "animate-diamond-3", color: "from-white to-cyan-300" },
  { size: "w-2 h-2", left: "92%", bottom: "12%", anim: "animate-diamond-1", color: "from-white to-indigo-400" },

  // --- LAPIS 2: TENGAH (Mulai sedikit, ukuran menyusut) ---
  { size: "w-2.5 h-2.5", left: "18%", bottom: "25%", anim: "animate-diamond-3", color: "from-white to-cyan-400" },
  { size: "w-2 h-2", left: "35%", bottom: "35%", anim: "animate-diamond-1", color: "from-white to-blue-300" },
  { size: "w-3 h-3", left: "60%", bottom: "28%", anim: "animate-diamond-2", color: "from-white to-indigo-400" },
  { size: "w-2 h-2", left: "80%", bottom: "38%", anim: "animate-diamond-3", color: "from-white to-cyan-300" },

  // --- LAPIS 3: ATAS (Sangat sedikit, ukuran paling kecil) ---
  { size: "w-1.5 h-1.5", left: "28%", bottom: "55%", anim: "animate-diamond-2", color: "from-white/70 to-blue-400/70" },
  { size: "w-2 h-2", left: "50%", bottom: "65%", anim: "animate-diamond-1", color: "from-white/70 to-cyan-300/70" },
  { size: "w-1 h-1", left: "75%", bottom: "75%", anim: "animate-diamond-3", color: "from-white/70 to-indigo-300/70" },
]

export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none z-0", className)}>
      
      {/* MENGHALUSKAN BATAS ATAS (MASKING)
        Efek ini membuat seluruh ornamen perlahan memudar menghilang saat mencapai 
        ketinggian 60% dari kotak, jadi tidak terpotong kaku.
      */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 60%)",
          WebkitMaskImage: "-webkit-linear-gradient(top, transparent 0%, black 60%)",
        }}
      >
        {/* Glow Atmosfer Dasar (Menciptakan nuansa biru di bagian bawah) */}
        <div className="absolute -bottom-10 left-0 right-0 h-40 bg-linear-to-t from-blue-500/10 to-transparent blur-2xl" />
        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

        {/* Render Partikel Belah Ketupat */}
        {diamonds.map((d, i) => (
          <div
            key={i}
            className={cn(
              "absolute rounded-[1px] bg-linear-to-tr shadow-[0_0_10px_rgba(255,255,255,0.4)]",
              d.size,
              d.anim,
              d.color
            )}
            style={{
              left: d.left,
              bottom: d.bottom,
              /* Rotasi dasar ditangani langsung di CSS Keyframes, jadi kita tidak perlu pasang rotate-45 di sini */
            }}
          />
        ))}
      </div>
    </div>
  )
}