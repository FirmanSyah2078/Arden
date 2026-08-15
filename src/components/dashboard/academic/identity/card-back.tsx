"use client"

import React from "react"

import { QrCornerFrame } from "../qr-corner-frame"
import { F_LABEL } from "../fonts"
import type { IdentityCardData } from "../card-data"

interface IdentityCardBackProps {
  data: IdentityCardData
}

/**
 * Background grid tipis.
 * Tidak menerima pointer dan tidak memiliki transform sendiri.
 */
function GridTexture() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="identity-card-back-grid"
          width="18"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <path d="M18 0H0V18" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#identity-card-back-grid)" />
    </svg>
  )
}

/**
 * Garis dekoratif orange.
 *
 * Animasi hanya terjadi pada garis.
 * Tidak ada transform / motion pada QR.
 */
function SignalTrace() {
  return (
    <svg
      viewBox="0 0 400 240"
      className="pointer-events-none absolute inset-0 h-full w-full"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="identity-card-back-trace"
          x1="0"
          y1="0"
          x2="400"
          y2="240"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ff9a52" stopOpacity="0.85" />

          <stop offset="100%" stopColor="#ff6a2b" stopOpacity="0.12" />
        </linearGradient>

        <linearGradient
          id="identity-card-back-signal"
          x1="0"
          y1="0"
          x2="400"
          y2="240"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ff6a2b" stopOpacity="0" />

          <stop offset="42%" stopColor="#ffb27a" stopOpacity="0.75" />

          <stop offset="50%" stopColor="#ffd1b3" stopOpacity="1" />

          <stop offset="58%" stopColor="#ff8a4c" stopOpacity="0.75" />

          <stop offset="100%" stopColor="#ff6a2b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Base line */}
      <path
        d="M60 -20 L60 60 L140 60 L140 130 L220 130 L220 40 L300 40 L300 260"
        stroke="url(#identity-card-back-trace)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />

      {/* Secondary base line */}
      <path
        d="M100 -20 L100 90 L180 90 L180 170 L260 170 L260 60 L340 60 L340 260"
        stroke="url(#identity-card-back-trace)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.22"
      />

      {/* Animated signal 1 */}
      <path
        d="M60 -20 L60 60 L140 60 L140 130 L220 130 L220 40 L300 40 L300 260"
        pathLength={1}
        stroke="url(#identity-card-back-signal)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="0.12 0.88"
        opacity="0.9"
        style={{
          animation: "identity-card-signal-one 6.5s linear infinite",
          filter: "drop-shadow(0 0 4px rgba(255,106,43,0.7))",
        }}
      />

      {/* Animated signal 2 */}
      <path
        d="M100 -20 L100 90 L180 90 L180 170 L260 170 L260 60 L340 60 L340 260"
        pathLength={1}
        stroke="url(#identity-card-back-signal)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="0.08 0.92"
        opacity="0.7"
        style={{
          animation: "identity-card-signal-two 8.5s linear infinite",
          animationDelay: "-2.1s",
          filter: "drop-shadow(0 0 3px rgba(255,106,43,0.5))",
        }}
      />
    </svg>
  )
}

export function IdentityCardBack({ data }: IdentityCardBackProps) {
  const qrValue = data.qrData || data.icode

  const qrSrc =
    "https://api.qrserver.com/v1/create-qr-code/" +
    "?size=220x220" +
    "&margin=0" +
    "&color=d4d4d8" +
    "&bgcolor=1c1d22" +
    `&data=${encodeURIComponent(qrValue)}`

  return (
    <>
      {/* =====================================================
          ANIMATION
          ===================================================== */}

      <style jsx>{`
        @keyframes identity-card-signal-one {
          0% {
            stroke-dashoffset: 1;
            opacity: 0.15;
          }

          20% {
            opacity: 0.55;
          }

          45% {
            opacity: 1;
          }

          70% {
            opacity: 0.55;
          }

          100% {
            stroke-dashoffset: -1;
            opacity: 0.15;
          }
        }

        @keyframes identity-card-signal-two {
          0% {
            stroke-dashoffset: 1;
            opacity: 0;
          }

          25% {
            opacity: 0.25;
          }

          50% {
            opacity: 0.7;
          }

          75% {
            opacity: 0.25;
          }

          100% {
            stroke-dashoffset: -1;
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .identity-card-back-signal {
            animation: none !important;
          }
        }
      `}</style>

      {/* =====================================================
          CARD
          ===================================================== */}

      <div
        className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background:
            "radial-gradient(120% 140% at 85% 0%, #1c1d22 0%, #101114 55%, #0a0a0c 100%)",
        }}
      >
        {/* ===================================================
            BACKGROUND
            =================================================== */}

        <GridTexture />

        <SignalTrace />

        {/* ===================================================
            CONTENT
            =================================================== */}

        <div className="relative flex h-full flex-col p-7">
          {/* =================================================
              HEADER
              ================================================= */}

          <div className="flex items-center gap-3">
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

          {/* =================================================
              QR AREA
              ================================================= */}

          <div className="z-10 -mb-3 flex flex-1 flex-col items-start justify-end gap-3">
            <div
              className="relative"
              style={{
                /*
                 * QR tidak mempunyai transform sendiri.
                 *
                 * Transform 3D hanya berasal dari
                 * parent card-panel.
                 */
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <QrCornerFrame cornerSize="w-4 h-4" className="bg-[#1c1d22]/95">
                <img
                  src={qrSrc}
                  alt="QR verifikasi"
                  width={110}
                  height={110}
                  draggable={false}
                  className="block h-18.5 w-18.5 opacity-95 select-none"
                  style={{
                    /*
                     * Jangan beri rotate / scale / translate
                     * tambahan pada QR.
                     */
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                />
              </QrCornerFrame>
            </div>

            {/* ===============================================
                ID CODE
                =============================================== */}

            <span
              className="text-[9px] font-medium tracking-[0.2em] text-orange-400"
              style={F_LABEL}
            >
              {data.icode}
            </span>
          </div>

          {/* =================================================
              DESCRIPTION
              ================================================= */}

          <div className="absolute top-7 right-7 bottom-7 flex items-center justify-center">
            <span
              className="font-sans text-[7.5px] font-medium tracking-[0.3em] whitespace-nowrap text-neutral-500 uppercase"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              Digunakan selama menjadi siswi
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
