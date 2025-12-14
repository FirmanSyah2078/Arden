"use client"

import { useCallback } from "react"
import type { Engine } from "tsparticles-engine"
import Particles from "react-tsparticles"
import { loadSlim } from "tsparticles-slim"

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 z-0 pointer-events-none"
      options={{
        fpsLimit: 60,
        fullScreen: { enable: false },
        particles: {
          number: {
            value: 50, // Jumlah partikel optimal (agar tidak lag dengan Vanta)
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: "#ffffff",
          },
          shape: {
            type: "edge", // <--- SESUAI REQUEST (Bentuk Kotak/Edge)
            stroke: {
              width: 0,
              color: "#000000",
            },
            // Polygon side ini biasanya diabaikan jika type='edge', tapi kita biarkan saja
            polygon: {
              nb_sides: 9, 
            },
          },
          opacity: {
            value: 0.3, // Transparansi
            random: true,
            anim: {
              enable: false,
            },
          },
          size: {
            value: 4, // Ukuran sedikit lebih besar
            random: true,
            anim: {
              enable: false,
            },
          },
          line_linked: {
            enable: false, // Tidak ada garis penghubung (biar seperti hujan)
          },
          move: {
            enable: true,
            speed: 3, // Kecepatan jatuh (sesuai config "direction: bottom")
            direction: "bottom",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
          },
        },
        detectRetina: true,
      }}
    />
  )
}