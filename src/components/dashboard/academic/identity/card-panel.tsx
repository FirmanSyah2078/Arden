"use client"

import React, {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  ChevronsUpDown,
  MousePointer2,
  RotateCw,
} from "lucide-react"

import type { IdentityCardData } from "../card-data"

import {
  CARD_SIZES,
  IdentityCardPrint,
  type CardSizeKey,
} from "./card-print"

import { IdentityCardFront } from "./card-front"
import { IdentityCardBack } from "./card-back"

import {
  FLIP_DURATION,
  FLIP_EASING,
  useIdentityCardMotion,
} from "./card-motion"

interface IdentityCardPanelProps {
  data: IdentityCardData
}

export function IdentityCardPanel({
  data,
}: IdentityCardPanelProps) {
  /*
   * ============================================================
   * CARD MOTION
   * ============================================================
   */

  const cardRef = useRef<HTMLDivElement | null>(null)

  /*
   * ============================================================
   * PRINT MENU
   * ============================================================
   */

  const printMenuRef = useRef<HTMLDivElement | null>(null)

  const [printOpen, setPrintOpen] = useState(false)

  /*
   * Ukuran default:
   * ISO = 85.6 × 53.98 mm
   */

  const [printSize, setPrintSize] =
    useState<CardSizeKey>("iso")

  /*
   * ============================================================
   * CLOSE PRINT MENU
   * ============================================================
   */

  useEffect(() => {
    if (!printOpen) {
      return
    }

    function handlePointerDown(
      event: PointerEvent
    ) {
      const target = event.target

      if (!(target instanceof Node)) {
        return
      }

      if (
        printMenuRef.current?.contains(
          target
        )
      ) {
        return
      }

      setPrintOpen(false)
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setPrintOpen(false)
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    )

    document.addEventListener(
      "keydown",
      handleKeyDown
    )

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      )

      document.removeEventListener(
        "keydown",
        handleKeyDown
      )
    }
  }, [printOpen])

  /*
   * ============================================================
   * CARD MOTION
   * ============================================================
   */

  const {
    flipped,
    isFlipping,
    hovering,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    handleFlip,
    handleTransitionEnd,
  } = useIdentityCardMotion({
    cardRef,
  })

  /*
   * ============================================================
   * PRINT
   * ============================================================
   *
   * Print layer sebenarnya selalu dirender oleh React.
   *
   * CSS print yang menentukan apakah layer tersebut
   * terlihat di layar atau hanya ketika print.
   */

  function handlePrint() {
    /*
     * Tutup popover terlebih dahulu.
     */

    setPrintOpen(false)

    /*
     * Beri browser kesempatan menyelesaikan:
     *
     * - perubahan state
     * - layout
     * - image/layout calculation
     *
     * sebelum membuka print dialog.
     */

    window.setTimeout(() => {
      window.print()
    }, 100)
  }

  return (
    <>
      {/* ======================================================
          MAIN PANEL
          ====================================================== */}

      <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-[#0f0f12] shadow-xl">
        {/* ====================================================
            HEADER
            ==================================================== */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-5 py-3.5">
          <h2 className="text-sm font-medium text-white">
            Generate Interactive Identity Card
          </h2>

          <div className="flex items-center gap-2">
            {/* ==================================================
                PRINT CONTROL
                ================================================== */}

            <div
              ref={printMenuRef}
              className="relative"
            >
              {/* ==================================================
                  PRINT BUTTON
                  ================================================== */}

              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={printOpen}
                onClick={() => {
                  setPrintOpen(
                    (current) =>
                      !current
                  )
                }}
                className={`sidebar-shine flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-300 ${
                  printOpen
                    ? "bg-white/10 text-white"
                    : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>
                  Print
                </span>

                <ChevronsUpDown
                  size={12}
                  className={`ml-1 transition-transform duration-200 ${
                    printOpen
                      ? "text-orange-400"
                      : "text-neutral-500"
                  }`}
                />
              </button>

              {/* ==================================================
                  PRINT POPOVER
                  ================================================== */}

              {printOpen && (
                <div
                  role="dialog"
                  aria-label="Pengaturan cetak kartu"
                  className="absolute right-0 z-50 mt-2 w-[290px] overflow-hidden rounded-2xl border border-white/10 bg-[#141417]/95 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                >
                  {/* ==============================================
                      POPOVER HEADER
                      ============================================== */}

                  <div className="px-2.5 pt-1 pb-2.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-medium tracking-[0.14em] text-neutral-500 uppercase">
                        Ukuran Cetak
                      </p>

                      <span className="font-mono text-[9px] text-neutral-600">
                        CARD FORMAT
                      </span>
                    </div>
                  </div>

                  {/* ==============================================
                      SIZE OPTIONS
                      ============================================== */}

                  <div className="space-y-1">
                    {(
                      Object.entries(
                        CARD_SIZES
                      ) as [
                        CardSizeKey,
                        (typeof CARD_SIZES)[CardSizeKey],
                      ][]
                    ).map(
                      ([key, size]) => {
                        const isActive =
                          printSize === key

                        return (
                          <button
                            key={key}
                            type="button"
                            aria-pressed={
                              isActive
                            }
                            onClick={() => {
                              setPrintSize(
                                key
                              )
                            }}
                            className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                              isActive
                                ? "bg-orange-500/10 text-orange-300 ring-1 ring-orange-500/10"
                                : "text-neutral-300 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all ${
                                  isActive
                                    ? "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.7)]"
                                    : "bg-neutral-700 group-hover:bg-neutral-500"
                                }`}
                              />

                              <span
                                className={`truncate text-[11px] ${
                                  isActive
                                    ? "font-medium"
                                    : "font-normal"
                                }`}
                              >
                                {size.label}
                              </span>
                            </div>

                            <span
                              className={`ml-3 shrink-0 font-mono text-[10px] ${
                                isActive
                                  ? "text-orange-400/80"
                                  : "text-neutral-600"
                              }`}
                            >
                              {size.w}×
                              {size.h}
                              mm
                            </span>
                          </button>
                        )
                      }
                    )}
                  </div>

                  {/* ==============================================
                      CURRENT FORMAT INFO
                      ============================================== */}

                  <div className="my-2.5 border-t border-white/5" />

                  <div className="rounded-xl border border-white/5 bg-white/[0.025] px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-neutral-500">
                        Format
                      </span>

                      <span className="font-mono text-[10px] text-neutral-300">
                        PDF / PRINT
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between gap-3">
                      <span className="text-[10px] text-neutral-500">
                        Ukuran
                      </span>

                      <span className="font-mono text-[10px] text-orange-400/80">
                        {
                          CARD_SIZES[
                            printSize
                          ].w
                        }
                        ×
                        {
                          CARD_SIZES[
                            printSize
                          ].h
                        }
                        mm
                      </span>
                    </div>
                  </div>

                  {/* ==============================================
                      PRINT ACTION
                      ============================================== */}

                  <button
                    type="button"
                    onClick={
                      handlePrint
                    }
                    className="mt-2.5 flex w-full items-center justify-center rounded-xl bg-orange-500 px-3 py-2.5 text-[11px] font-medium text-white shadow-[0_6px_20px_rgba(249,115,22,0.12)] transition-all duration-200 hover:bg-orange-400 hover:shadow-[0_8px_24px_rgba(249,115,22,0.2)] active:scale-[0.99]"
                  >
                    Cetak Kartu
                  </button>
                </div>
              )}
            </div>

            {/* ==================================================
                FLIP
                ================================================== */}

            <button
              type="button"
              onClick={handleFlip}
              disabled={isFlipping}
              className="sidebar-shine flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors duration-300 hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-60"
            >
              <RotateCw
                size={13}
                className={
                  isFlipping
                    ? "animate-spin"
                    : ""
                }
              />

              Balik kartu
            </button>
          </div>
        </div>

        {/* ====================================================
            CARD AREA
            ==================================================== */}

        <div className="relative flex flex-1 flex-col items-center justify-center p-6 sm:p-10">
          <div
            className="relative mt-4 mb-6"
            style={{
              perspective:
                "3600px",
            }}
          >
            {/* ==================================================
                OUTER MOTION
                ================================================== */}

            <div
              ref={cardRef}
              onPointerMove={
                handlePointerMove
              }
              onPointerEnter={
                handlePointerEnter
              }
              onPointerLeave={
                handlePointerLeave
              }
              className="relative h-57 w-95 sm:h-60 sm:w-100"
              style={{
                transformStyle:
                  "preserve-3d",

                transform:
                  "rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",

                transition:
                  isFlipping
                    ? `transform ${FLIP_DURATION}ms ${FLIP_EASING}`
                    : hovering
                      ? "transform 80ms linear"
                      : "transform 600ms cubic-bezier(0.22,1,0.36,1)",

                willChange:
                  "transform",

                userSelect:
                  "none",
              }}
            >
              {/* =================================================
                  FLIP LAYER
                  ================================================= */}

              <div
                role="button"
                tabIndex={0}
                aria-label={
                  flipped
                    ? "Balik ke bagian depan kartu"
                    : "Balik ke bagian belakang kartu"
                }
                aria-pressed={
                  flipped
                }
                onClick={
                  handleFlip
                }
                onKeyDown={(
                  event
                ) => {
                  if (
                    event.key ===
                      "Enter" ||
                    event.key ===
                      " "
                  ) {
                    event.preventDefault()

                    handleFlip()
                  }
                }}
                onTransitionEnd={
                  handleTransitionEnd
                }
                className="absolute inset-0 h-full w-full cursor-pointer outline-none"
                style={{
                  transformStyle:
                    "preserve-3d",

                  transform: `rotateY(${
                    flipped
                      ? 180
                      : 0
                  }deg)`,

                  transition: `transform ${FLIP_DURATION}ms ${FLIP_EASING}`,

                  willChange:
                    "transform",
                }}
              >
                {/* FRONT */}

                <IdentityCardFront
                  data={data}
                />

                {/* BACK */}

                <IdentityCardBack
                  data={data}
                />
              </div>

              {/* =================================================
                  SHADOW
                  ================================================= */}

              <div
                className="pointer-events-none absolute top-full left-1/2 h-8 w-80 -translate-x-1/2 rounded-full bg-black/60 blur-2xl"
                style={{
                  transform: `translateX(-50%) scale(${
                    isFlipping
                      ? 0.85
                      : 1
                  })`,

                  opacity:
                    isFlipping
                      ? 0.25
                      : 0.5,

                  transition: `all ${FLIP_DURATION}ms ${FLIP_EASING}`,
                }}
              />
            </div>

            {/* =================================================
                HELPER
                ================================================= */}

            <div className="mt-6 text-center">
              <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-500">
                <MousePointer2
                  size={14}
                  className="animate-nudge-x text-orange-400/80"
                />

                {flipped
                  ? "Gerakkan kursor di atas kartu, klik untuk kembali"
                  : "Gerakkan kursor di atas kartu, klik untuk membalik"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          PRINT RENDER
          ====================================================== */}

      <IdentityCardPrint
        data={data}
        printSize={printSize}
      />
    </>
  )
}