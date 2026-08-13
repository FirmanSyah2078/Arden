"use client"

import React from "react"

import { User } from "lucide-react"

import {
  F_DISPLAY,
  F_LABEL,
} from "../fonts"

import type { IdentityCardData } from "../card-data"

/**
 * ============================================================
 * CARD PRINT SIZE
 * ============================================================
 */

export const CARD_SIZES = {
  iso: {
    label: "Standar ISO (KTP / SIM)",
    w: 85.6,
    h: 53.98,
  },

  alt1: {
    label: "Alternatif (mirip kartu nama)",
    w: 90,
    h: 53,
  },

  alt2: {
    label: "Alternatif (mirip kartu nama)",
    w: 90,
    h: 55,
  },
} as const

export type CardSizeKey =
  keyof typeof CARD_SIZES

interface IdentityCardPrintProps {
  data: IdentityCardData
  printSize: CardSizeKey
}

/**
 * ============================================================
 * PRINT CARD FRONT
 * ============================================================
 */

function PrintCardFront({
  data,
  width,
  height,
}: {
  data: IdentityCardData
  width: number
  height: number
}) {
  return (
    <div
      className="print-card relative overflow-hidden rounded-[4mm] border border-white/10"
      style={{
        width: `${width}mm`,
        height: `${height}mm`,
        background:
          "radial-gradient(120% 140% at 15% 10%, #1c1d22 0%, #101114 55%, #0a0a0c 100%)",
      }}
    >
      {/* ======================================================
          GRID
          ====================================================== */}

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="print-card-grid-front"
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
          fill="url(#print-card-grid-front)"
        />
      </svg>

      {/* ======================================================
          ORANGE GLOW
          ====================================================== */}

      <div
        className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl"
        aria-hidden="true"
      />

      {/* ======================================================
          CONTENT
          ====================================================== */}

      <div className="relative flex h-full flex-col px-[6.5mm] pt-[4.5mm] pb-[4mm]">
        {/* ====================================================
            HEADER
            ==================================================== */}

        <div className="mb-[3.5mm] flex items-center gap-[2mm]">
          <img
            src="/icon.ico"
            alt="Logo"
            className="h-[4.5mm] w-[4.5mm] object-contain"
            draggable={false}
          />

          <span
            className="text-[10px] font-semibold tracking-wide text-white"
            style={F_DISPLAY}
          >
            Identity Card Arden
          </span>
        </div>

        {/* ====================================================
            MAIN
            ==================================================== */}

        <div className="flex flex-1 items-stretch gap-[4.5mm]">
          {/* PHOTO */}

          <div
            className="relative shrink-0 overflow-hidden rounded-[3mm] border border-white/10 bg-[#1c1e24]"
            style={{
              width: "21.5mm",
              height: "29mm",
            }}
          >
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
                  size={22}
                  strokeWidth={1.4}
                />
              </div>
            )}
          </div>

          {/* INFORMATION */}

          <div className="flex min-w-0 flex-1 flex-col justify-center">
            {/* NAME */}

            <div className="mb-[3.5mm]">
              <p
                className="truncate text-[16px] leading-[1.1] font-semibold tracking-[-0.025em] text-white"
                style={F_DISPLAY}
              >
                {data.name}
              </p>

              <p
                className="mt-[1.5mm] text-[9px] font-medium tracking-[0.18em] text-orange-400 uppercase"
                style={F_LABEL}
              >
                {data.nis}
              </p>
            </div>

            {/* INFORMATION GRID */}

            <div className="grid grid-cols-2 gap-x-[4mm] gap-y-[2.5mm]">
              <div className="min-w-0">
                <p className="text-[6.5px] tracking-[0.14em] text-neutral-500 uppercase">
                  Kelas
                </p>

                <p className="mt-[0.5mm] truncate text-[9px] font-medium text-neutral-200">
                  {data.kelas}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[6.5px] tracking-[0.14em] text-neutral-500 uppercase">
                  Angkatan
                </p>

                <p className="mt-[0.5mm] truncate text-[9px] font-medium text-neutral-200">
                  {data.angkatan}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[6.5px] tracking-[0.14em] text-neutral-500 uppercase">
                  Wali Kelas
                </p>

                <p className="mt-[0.5mm] text-[9px] leading-tight font-medium text-neutral-200">
                  {data.waliKelas}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[6.5px] tracking-[0.14em] text-neutral-500 uppercase">
                  Berlaku s/d
                </p>

                <p className="mt-[0.5mm] text-[9px] font-medium text-neutral-200">
                  {data.validUntil}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          STATIC ORANGE SIGNAL
          ====================================================== */}

      <svg
        className="pointer-events-none absolute right-0 bottom-0 h-[24mm] w-[24mm] opacity-70"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M100 20 L60 20 L60 60 L20 60 L20 100"
          stroke="#FF6A2B"
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx="60"
          cy="60"
          r="1.8"
          fill="#FF8A4C"
          opacity="0.5"
        />
      </svg>
    </div>
  )
}

/**
 * ============================================================
 * PRINT CARD BACK
 * ============================================================
 */

function PrintCardBack({
  data,
  width,
  height,
}: {
  data: IdentityCardData
  width: number
  height: number
}) {
  const qrValue =
    data.qrData || data.icode

  const qrSrc =
    "https://api.qrserver.com/v1/create-qr-code/" +
    "?size=220x220" +
    "&margin=0" +
    "&color=d4d4d8" +
    "&bgcolor=1c1d22" +
    `&data=${encodeURIComponent(qrValue)}`

  return (
    <div
      className="print-card relative overflow-hidden rounded-[4mm] border border-white/10"
      style={{
        width: `${width}mm`,
        height: `${height}mm`,
        background:
          "radial-gradient(120% 140% at 85% 0%, #1c1d22 0%, #101114 55%, #0a0a0c 100%)",
      }}
    >
      {/* GRID */}

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="print-card-grid-back"
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
          fill="url(#print-card-grid-back)"
        />
      </svg>

      {/* ORANGE TRACE */}

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 400 240"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M60 -20 L60 60 L140 60 L140 130 L220 130 L220 40 L300 40 L300 260"
          stroke="#FF6A2B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.25"
        />

        <path
          d="M100 -20 L100 90 L180 90 L180 170 L260 170 L260 60 L340 60 L340 260"
          stroke="#FF6A2B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.12"
        />
      </svg>

      {/* CONTENT */}

      <div className="relative flex h-full flex-col p-[6.5mm]">
        {/* HEADER */}

        <div className="flex items-center gap-[2mm]">
          <img
            src="/icon.ico"
            alt="Logo"
            className="h-[4.5mm] w-[4.5mm] object-contain"
            draggable={false}
          />

          <span
            className="text-[10px] font-semibold tracking-wide text-white"
            style={F_DISPLAY}
          >
            Identity Card Arden
          </span>
        </div>

        {/* QR AREA */}

        <div className="relative z-10 flex flex-1 items-end gap-[5mm] pb-[1mm]">
          {/* QR */}

          <div className="relative shrink-0 rounded-[2mm] border border-orange-500/30 bg-[#1c1d22] p-[2mm]">
            <span className="pointer-events-none absolute -top-px -left-px h-[4mm] w-[4mm] border-t-[1px] border-l-[1px] border-orange-500/80" />

            <span className="pointer-events-none absolute -top-px -right-px h-[4mm] w-[4mm] border-t-[1px] border-r-[1px] border-orange-500/80" />

            <span className="pointer-events-none absolute -bottom-px -left-px h-[4mm] w-[4mm] border-b-[1px] border-l-[1px] border-orange-500/80" />

            <span className="pointer-events-none absolute -right-px -bottom-px h-[4mm] w-[4mm] border-r-[1px] border-b-[1px] border-orange-500/80" />

            <img
              src={qrSrc}
              alt="QR verifikasi"
              width={220}
              height={220}
              className="block h-[18.5mm] w-[18.5mm] opacity-95"
              draggable={false}
            />
          </div>

          {/* CODE */}

          <div className="flex min-w-0 flex-col pb-[1mm]">
            <span
              className="text-[9px] font-medium tracking-[0.2em] text-orange-400"
              style={F_LABEL}
            >
              {data.icode}
            </span>

            <span className="mt-[2mm] max-w-[30mm] text-[6.5px] leading-[1.45] text-neutral-500">
              Kartu identitas resmi.
              Gunakan QR untuk
              verifikasi data.
            </span>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex items-end justify-between">
          <span
            className="text-[6.5px] tracking-[0.12em] text-neutral-600 uppercase"
            style={F_LABEL}
          >
            Arden Identity System
          </span>

          <span className="text-[6.5px] text-neutral-500">
            Berlaku s/d{" "}
            {data.validUntil}
          </span>
        </div>

        {/* VERTICAL DESCRIPTION */}

        <div className="absolute top-[6.5mm] right-[6.5mm] bottom-[6.5mm] flex items-center justify-center">
          <span
            className="font-sans text-[6.5px] font-medium tracking-[0.3em] whitespace-nowrap text-neutral-500 uppercase"
            style={{
              writingMode:
                "vertical-rl",
              transform:
                "rotate(180deg)",
            }}
          >
            Digunakan selama menjadi siswi
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * ============================================================
 * CUT MARKS
 * ============================================================
 */

function CutMarks({
  width,
  height,
}: {
  width: number
  height: number
}) {
  const mark = 3

  return (
    <div
      className="identity-card-cut-mark pointer-events-none absolute"
      style={{
        width: `${width}mm`,
        height: `${height}mm`,
      }}
      aria-hidden="true"
    >
      <span
        className="absolute"
        style={{
          left: `-${mark}mm`,
          top: 0,
          width: `${mark}mm`,
          borderTop:
            "0.2mm solid #777",
        }}
      />

      <span
        className="absolute"
        style={{
          left: 0,
          top: `-${mark}mm`,
          height: `${mark}mm`,
          borderLeft:
            "0.2mm solid #777",
        }}
      />

      <span
        className="absolute"
        style={{
          right: `-${mark}mm`,
          top: 0,
          width: `${mark}mm`,
          borderTop:
            "0.2mm solid #777",
        }}
      />

      <span
        className="absolute"
        style={{
          right: 0,
          top: `-${mark}mm`,
          height: `${mark}mm`,
          borderRight:
            "0.2mm solid #777",
        }}
      />

      <span
        className="absolute"
        style={{
          left: `-${mark}mm`,
          bottom: 0,
          width: `${mark}mm`,
          borderBottom:
            "0.2mm solid #777",
        }}
      />

      <span
        className="absolute"
        style={{
          left: 0,
          bottom: `-${mark}mm`,
          height: `${mark}mm`,
          borderLeft:
            "0.2mm solid #777",
        }}
      />

      <span
        className="absolute"
        style={{
          right: `-${mark}mm`,
          bottom: 0,
          width: `${mark}mm`,
          borderBottom:
            "0.2mm solid #777",
        }}
      />

      <span
        className="absolute"
        style={{
          right: 0,
          bottom: `-${mark}mm`,
          height: `${mark}mm`,
          borderRight:
            "0.2mm solid #777",
        }}
      />
    </div>
  )
}

/**
 * ============================================================
 * PRINT PAGE
 * ============================================================
 *
 * INI BAGIAN YANG SEBELUMNYA HILANG.
 *
 * Setiap sisi kartu mempunyai container A4 sendiri.
 *
 * Page 1 = FRONT
 * Page 2 = BACK
 */

function PrintPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="identity-card-print-page">
      {children}
    </div>
  )
}

/**
 * ============================================================
 * MAIN PRINT COMPONENT
 * ============================================================
 */

export function IdentityCardPrint({
  data,
  printSize,
}: IdentityCardPrintProps) {
  const activeSize =
    CARD_SIZES[printSize]

  return (
    <>
      {/* ======================================================
          PRINT CSS
          ====================================================== */}

      <style jsx global>{`
        /*
         * =====================================================
         * SCREEN
         * =====================================================
         *
         * Print layer benar-benar tidak terlihat
         * pada halaman normal.
         */

        .identity-card-print-root {
          display: none;
        }

        /*
         * =====================================================
         * PRINT
         * =====================================================
         */

        @media print {
          /*
           * ===================================================
           * PAGE
           * ===================================================
           */

          @page {
            size: A4 portrait;
            margin: 0;
          }

          /*
           * ===================================================
           * DOCUMENT
           * ===================================================
           */

          html,
          body {
            width: 210mm !important;
            min-width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;

            background: white !important;

            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /*
           * ===================================================
           * HIDE NORMAL APPLICATION
           * ===================================================
           */

          body * {
            visibility: hidden !important;
          }

          /*
           * ===================================================
           * PRINT ROOT
           * ===================================================
           */

          .identity-card-print-root {
            display: block !important;

            position: absolute !important;

            top: 0 !important;
            left: 0 !important;

            width: 210mm !important;

            margin: 0 !important;
            padding: 0 !important;

            background: white !important;

            visibility: visible !important;

            overflow: visible !important;
          }

          /*
           * Root dan seluruh turunannya harus visible.
           */

          .identity-card-print-root,
          .identity-card-print-root * {
            visibility: visible !important;
          }

          /*
           * ===================================================
           * A4 PAGE
           * ===================================================
           */

          .identity-card-print-page {
            position: relative !important;

            display: flex !important;

            width: 210mm !important;
            height: 297mm !important;

            margin: 0 !important;
            padding: 0 !important;

            align-items: flex-start !important;
            justify-content: flex-start !important;

            page-break-after: always !important;
            break-after: page !important;

            page-break-inside: avoid !important;
            break-inside: avoid !important;

            overflow: visible !important;
          }

          /*
           * Halaman terakhir tidak membuat page kosong.
           */

          .identity-card-print-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }

          /*
           * ===================================================
           * CARD WRAPPER
           * ===================================================
           *
           * Posisi 0,0 pada setiap halaman.
           */

          .identity-card-print-page
            > div {
            position: relative !important;

            flex: 0 0 auto !important;

            width: auto !important;
            height: auto !important;

            margin: 0 !important;
            padding: 0 !important;
          }

          /*
           * ===================================================
           * CARD
           * ===================================================
           */

          .identity-card-print-root
            .print-card {
            position: relative !important;

            flex: 0 0 auto !important;

            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;

            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /*
           * ===================================================
           * CUT MARKS
           * ===================================================
           */

          .identity-card-print-root
            .identity-card-cut-mark {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /*
           * ===================================================
           * IMAGES
           * ===================================================
           */

          .identity-card-print-root img {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /*
           * ===================================================
           * SVG
           * ===================================================
           */

          .identity-card-print-root svg {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* ======================================================
          PRINT ROOT
          ====================================================== */}

      <div
        className="identity-card-print-root"
        aria-hidden="true"
      >
        {/* ====================================================
            PAGE 1 — FRONT
            ==================================================== */}

        <PrintPage>
          <div className="relative shrink-0">
            <PrintCardFront
              data={data}
              width={activeSize.w}
              height={activeSize.h}
            />

            <CutMarks
              width={activeSize.w}
              height={activeSize.h}
            />
          </div>
        </PrintPage>

        {/* ====================================================
            PAGE 2 — BACK
            ==================================================== */}

        <PrintPage>
          <div className="relative shrink-0">
            <PrintCardBack
              data={data}
              width={activeSize.w}
              height={activeSize.h}
            />

            <CutMarks
              width={activeSize.w}
              height={activeSize.h}
            />
          </div>
        </PrintPage>
      </div>
    </>
  )
}