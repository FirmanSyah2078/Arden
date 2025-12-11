"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
// @ts-expect-error Vanta library does not have TypeScript type definitions
import FOG from "vanta/dist/vanta.fog.min"

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const [vantaEffect, setVantaEffect] = useState<{ destroy: () => void } | null>(null)

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      try {
        setVantaEffect(
          FOG({
            el: vantaRef.current,
            THREE: THREE, // Wajib di-pass ke Vanta di environment React
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            highlightColor: 0x0,      // Hitam
            midtoneColor: 0x48,    // Ungu gelap (sesuai request)
            lowlightColor: 0x1b1b84,  // Biru gelap (sesuai request)
            baseColor: 0x0,           // Hitam
            blurFactor: 0.6,          // Tambahan: biar agak smooth
            speed: 1.50,               // Tambahan: kecepatan gerak kabut
            zoom: 0.90
          })
        )
      } catch (error) {
        console.error("[VANTA] Error initializing vanta effect:", error)
      }
    }

    // Cleanup function (penting agar tidak memakan memori saat pindah halaman)
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <div 
      ref={vantaRef} 
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
    />
  )
}