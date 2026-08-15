import React from "react"
import { User } from "lucide-react"

import type { IdentityCardData } from "../card-data"
import { F_DISPLAY } from "../fonts"

interface IdentityCardFrontProps {
  data: IdentityCardData
}

/**
 * ============================================================
 * GRID TEXTURE
 * ============================================================
 */

function GridTexture() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="identity-card-grid-front"
          width="18"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M18 0H0V18"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill="url(#identity-card-grid-front)"
      />
    </svg>
  )
}

/**
 * ============================================================
 * FRONT ORANGE SIGNAL
 * ============================================================
 *
 * Garis orange tetap berada di posisi desain awal.
 * Hanya highlight kecil yang bergerak mengikuti jalurnya.
 */

function FrontSignalTrace() {
  return (
    <>
      <style>
        {`
          @keyframes identity-card-front-signal {
            0% {
              stroke-dashoffset: 1;
              opacity: 0;
            }

            15% {
              opacity: 0.25;
            }

            35% {
              opacity: 0.8;
            }

            50% {
              opacity: 1;
            }

            65% {
              opacity: 0.8;
            }

            85% {
              opacity: 0.25;
            }

            100% {
              stroke-dashoffset: -1;
              opacity: 0;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .identity-card-front-signal {
              animation: none !important;
              opacity: 0.35 !important;
            }
          }
        `}
      </style>

      <svg
        className="pointer-events-none absolute right-0 bottom-0 h-24 w-24 opacity-70"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          {/* ==================================================
              BASE LINE
              ================================================== */}

          <linearGradient
            id="identity-card-front-line"
            x1="100"
            y1="20"
            x2="20"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0%"
              stopColor="#FF9A52"
              stopOpacity="0.55"
            />

            <stop
              offset="100%"
              stopColor="#FF6A2B"
              stopOpacity="0.18"
            />
          </linearGradient>

          {/* ==================================================
              MOVING SIGNAL
              ================================================== */}

          <linearGradient
            id="identity-card-front-signal"
            x1="100"
            y1="20"
            x2="20"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0%"
              stopColor="#FF6A2B"
              stopOpacity="0"
            />

            <stop
              offset="40%"
              stopColor="#FF9A52"
              stopOpacity="0.65"
            />

            <stop
              offset="50%"
              stopColor="#FFD1B3"
              stopOpacity="1"
            />

            <stop
              offset="60%"
              stopColor="#FF9A52"
              stopOpacity="0.65"
            />

            <stop
              offset="100%"
              stopColor="#FF6A2B"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/* ====================================================
            STATIC BASE LINE
            ==================================================== */}

        <path
          d="M100 20 L60 20 L60 60 L20 60 L20 100"
          stroke="url(#identity-card-front-line)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />

        {/* ====================================================
            MOVING SIGNAL
            ==================================================== */}

        <path
          className="identity-card-front-signal"
          d="M100 20 L60 20 L60 60 L20 60 L20 100"
          pathLength={1}
          stroke="url(#identity-card-front-signal)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0.14 0.86"
          style={{
            animation:
              "identity-card-front-signal 4.2s linear infinite",
            filter:
              "drop-shadow(0 0 4px rgba(255,106,43,0.65))",
          }}
        />

        {/* ====================================================
            SIGNAL NODE
            ==================================================== */}

        <circle
          cx="60"
          cy="60"
          r="1.8"
          fill="#FF8A4C"
          opacity="0.55"
        />
      </svg>
    </>
  )
}

/**
 * ============================================================
 * IDENTITY CARD FRONT
 * ============================================================
 */

export function IdentityCardFront({
  data,
}: IdentityCardFrontProps) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility:
          "hidden",

        background:
          "radial-gradient(120% 140% at 15% 10%, #1c1d22 0%, #101114 55%, #0a0a0c 100%)",
      }}
    >
      {/* ======================================================
          BACKGROUND
          ====================================================== */}

      <GridTexture />

      <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />

      {/* ======================================================
          CARD CONTENT
          ====================================================== */}

      <div className="relative flex h-full flex-col px-7 pt-5 pb-6">
        {/* ====================================================
            HEADER
            ==================================================== */}

        <div className="mb-5 flex items-center gap-3">
          <img
            src="/icon.ico"
            alt="Logo"
            className="h-5 w-5 object-contain"
            draggable={false}
          />

          <span className="text-[13px] font-semibold tracking-wide text-white">
            Identity Card Arden
          </span>
        </div>

        {/* ====================================================
            MAIN CONTENT
            ==================================================== */}

        <div className="flex flex-1 items-stretch gap-5">
          {/* ==================================================
              PHOTO
              ================================================== */}

          <div className="relative h-29 w-21.5 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#1c1e24] shadow-md">
            {data.photoSrc ? (
              <img
                src={data.photoSrc}
                alt={data.name}
                className="h-full w-full object-cover object-center"
                draggable={false}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-neutral-600">
                <User
                  size={28}
                  strokeWidth={1.4}
                />
              </div>
            )}
          </div>

          {/* ==================================================
              INFORMATION
              ================================================== */}

          <div className="flex flex-1 flex-col justify-center">
            {/* =================================================
                NAME + NIS
                ================================================= */}

            <div className="mb-3.5">
              <p
                className="text-[16px] leading-[1.1] font-semibold tracking-[-0.025em] text-white"
                style={F_DISPLAY}
              >
                {data.name}
              </p>

              <p className="mt-1.5 text-[9.5px] font-medium tracking-[0.18em] text-orange-400 uppercase">
                {data.nis}
              </p>
            </div>

            {/* =================================================
                INFORMATION GRID
                ================================================= */}

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {/* ==============================================
                  KELAS
                  ============================================== */}

              <div>
                <p className="text-[8.5px] tracking-[0.16em] text-neutral-500 uppercase">
                  Kelas
                </p>

                <p className="mt-0.5 text-[11.5px] font-medium text-neutral-200">
                  {data.kelas}
                </p>
              </div>

              {/* ==============================================
                  ANGKATAN
                  ============================================== */}

              <div>
                <p className="text-[8.5px] tracking-[0.16em] text-neutral-500 uppercase">
                  Angkatan
                </p>

                <p className="mt-0.5 text-[11.5px] font-medium text-neutral-200">
                  {data.angkatan}
                </p>
              </div>

              {/* ==============================================
                  WALI KELAS
                  ============================================== */}

              <div>
                <p className="text-[8.5px] tracking-[0.16em] text-neutral-500 uppercase">
                  Wali Kelas
                </p>

                <p className="mt-0.5 text-[11.5px] font-medium text-neutral-200">
                  {data.waliKelas}
                </p>
              </div>

              {/* ==============================================
                  BERLAKU S/D
                  ============================================== */}

              <div>
                <p className="text-[8.5px] tracking-[0.16em] text-neutral-500 uppercase">
                  Berlaku s/d
                </p>

                <p className="mt-0.5 text-[11.5px] font-medium text-neutral-200">
                  {data.validUntil}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          ANIMATED ORANGE LINE
          ====================================================== */}

      <FrontSignalTrace />
    </div>
  )
}