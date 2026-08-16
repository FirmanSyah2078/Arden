// src/components/dashboard/globals/generator-engine-preview.tsx

"use client"

import { useEffect, useRef, useState } from "react"

import { Download, RefreshCw, RotateCcw, Scan } from "lucide-react"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { ArdenQREngine } from "@/lib/qr/arden-qr-engine"

import type { GeneratorSettingsData } from "@/types/api"

// ============================================================
// PREVIEW DEFAULT
// ============================================================

const DEFAULT_PREVIEW_PAYLOAD = "ARD-48CCDA39"

// ============================================================
// PROPS
// ============================================================

interface GeneratorEnginePreviewProps {
  /**
   * Draft master configuration dari sisi kanan.
   *
   * Preview BOLEH membaca settings ini
   * agar QR mengikuti perubahan live.
   *
   * Preview TIDAK BOLEH mengubah object ini.
   */
  settings: GeneratorSettingsData

  /**
   * Loading state milik Generator Engine.
   */
  isLoading: boolean
}

// ============================================================
// COMPONENT
// ============================================================

export function GeneratorEnginePreview({
  settings,
  isLoading,
}: GeneratorEnginePreviewProps) {
  // ----------------------------------------------------------
  // PREVIEW-ONLY STATE
  // ----------------------------------------------------------
  //
  // Payload sengaja disimpan DI SINI.
  //
  // Bukan di useGenerate().
  //
  // Artinya payload preview tidak pernah menjadi bagian
  // dari Master Engine Configuration.
  // ----------------------------------------------------------

  const [previewPayload, setPreviewPayload] = useState(DEFAULT_PREVIEW_PAYLOAD)

  // ----------------------------------------------------------
  // DOM CONTAINER
  // ----------------------------------------------------------

  const containerRef = useRef<HTMLDivElement | null>(null)

  // ----------------------------------------------------------
  // PREVIEW ENGINE INSTANCE
  // ----------------------------------------------------------
  //
  // Ini adalah instance khusus untuk preview.
  //
  // Consumer lain nantinya memiliki instance sendiri.
  // ----------------------------------------------------------

  const engineRef = useRef<ArdenQREngine | null>(null)

  // ==========================================================
  // CREATE PREVIEW ENGINE
  // ==========================================================

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const engine = new ArdenQREngine({
      width: 180,
      height: 180,
    })

    engineRef.current = engine

    let active = true

    const initialize = async () => {
      try {
        await engine.render(container, previewPayload, settings, true)
      } catch (error) {
        if (!active) {
          return
        }

        console.error("Arden QR Engine preview initialization failed:", error)

        toast.error("QR Engine gagal melakukan render.")
      }
    }

    initialize()

    return () => {
      active = false

      engine.destroy()

      engineRef.current = null
    }

    // Engine hanya dibuat satu kali untuk lifecycle
    // component preview ini.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ==========================================================
  // LIVE UPDATE
  // ==========================================================
  //
  // Setiap:
  //
  // - payload berubah
  // - setting kanan berubah
  //
  // preview akan mengikuti.
  //
  // Tetapi perubahan tersebut tidak pernah dikirim balik
  // ke useGenerate().
  // ==========================================================

  useEffect(() => {
    const container = containerRef.current

    const engine = engineRef.current

    if (!container || !engine) {
      return
    }

    let active = true

    const update = async () => {
      try {
        await engine.render(container, previewPayload, settings)
      } catch (error) {
        if (!active) {
          return
        }

        console.error("Arden QR Engine preview update failed:", error)
      }
    }

    update()

    return () => {
      active = false
    }
  }, [previewPayload, settings])

  // ==========================================================
  // REFRESH PREVIEW
  // ==========================================================
  //
  // HANYA melakukan refresh terhadap instance QR preview.
  //
  // Tidak menyentuh:
  //
  // - settings
  // - savedSettings
  // - database
  // - Master Engine
  // ==========================================================

  const handleRefresh = async () => {
    const engine = engineRef.current

    if (!engine) {
      return
    }

    try {
      await engine.refresh()

      toast.success("QR Preview refreshed.", {
        duration: 1500,
      })
    } catch (error) {
      console.error("QR Preview refresh failed:", error)

      toast.error("Failed to refresh QR Preview.")
    }
  }

  // ==========================================================
  // RESET PREVIEW
  // ==========================================================
  //
  // PENTING:
  //
  // Ini BUKAN reset Engine.
  //
  // Ini hanya mengembalikan payload test preview.
  //
  // Settings kanan TIDAK DISENTUH.
  // ==========================================================

  const handleResetPreview = () => {
    setPreviewPayload(DEFAULT_PREVIEW_PAYLOAD)

    toast.info("Preview payload reset.", {
      duration: 1500,
    })
  }

  // ==========================================================
  // EXPORT
  // ==========================================================
  //
  // Export hanya mengambil QR yang sedang berada
  // di instance preview.
  //
  // Tidak melakukan Save Engine.
  // Tidak mengubah database.
  // ==========================================================

  const handleDownload = async (format: "png" | "svg") => {
    const engine = engineRef.current

    if (!engine) {
      toast.error("QR Preview belum siap.")

      return
    }

    try {
      await engine.download(format)

      toast.success(`QR Code downloaded as ${format.toUpperCase()}.`, {
        duration: 1800,
      })
    } catch (error) {
      console.error("QR Preview download failed:", error)

      toast.error("Failed to download QR Code.")
    }
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="flex w-full shrink-0 flex-col gap-4 md:w-[35%] lg:w-[30%]">
      {/* ========================================================
          LIVE PREVIEW AREA
          ======================================================== */}

      <div className="group border-border/40 bg-muted/20 relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border p-6">
        {/* ------------------------------------------------------
            OUTER STUDIO GRID
            ------------------------------------------------------
            
            Ini hanya dekorasi area studio.
            
            Dibuat lebih redup agar tidak mengambil perhatian
            dari QR.
        ------------------------------------------------------ */}

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] bg-size-[14px_14px]" />

        {/* ------------------------------------------------------
            QR CANVAS
        ------------------------------------------------------ */}

        <div
          className={[
            "relative z-10 size-45 overflow-hidden",
            "ring-border/20 shadow-xl ring-1",
            "transition-all duration-300",
            settings.qrShape === "circle" ? "rounded-full" : "rounded-md",
          ].join(" ")}
          style={{
            backgroundColor: settings.isBgTransparent
              ? "transparent"
              : settings.bgColor || "transparent",

            backgroundImage: settings.isBgTransparent
              ? `
        linear-gradient(
          45deg,
          rgba(148, 148, 148, 0.16) 25%,
          transparent 25%,
          transparent 75%,
          rgba(148, 148, 148, 0.16) 75%
        ),
        linear-gradient(
          45deg,
          rgba(148, 148, 148, 0.16) 25%,
          transparent 25%,
          transparent 75%,
          rgba(148, 148, 148, 0.16) 75%
        )
      `
              : "none",

            backgroundSize: settings.isBgTransparent ? "16px 16px" : "auto",

            backgroundPosition: settings.isBgTransparent
              ? "0 0, 8px 8px"
              : "0 0",
          }}
        >
          <div
            ref={containerRef}
            className="pointer-events-none flex size-full items-center justify-center"
          />
        </div>

        {/* ======================================================
            PAYLOAD INPUT
            ====================================================== */}

        <div className="relative z-10 mt-6 flex w-full justify-center px-2 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
          <div className="border-border/40 bg-background/50 focus-within:border-primary/50 focus-within:ring-primary/20 flex w-full items-center gap-2.5 rounded-lg border px-3 py-1.5 shadow-sm backdrop-blur-md transition-all focus-within:ring-1">
            <Scan className="text-muted-foreground size-3.5 shrink-0" />

            <div className="bg-border/60 h-3.5 w-px shrink-0" />

            <input
              type="text"
              value={previewPayload}
              onChange={(event) => setPreviewPayload(event.target.value)}
              disabled={isLoading}
              className="text-foreground m-0 w-full border-none bg-transparent p-0 font-mono text-[11px] font-semibold tracking-widest outline-none focus:ring-0 focus:outline-none disabled:opacity-50"
              placeholder="Test payload..."
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          PREVIEW CONTROLS
          ======================================================== */}

      <div className="grid w-full grid-cols-2 gap-3">
        {/* REFRESH */}

        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoading}
          className="group border-border/50 h-9 text-[11px] font-bold shadow-sm transition-colors hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
        >
          <RefreshCw className="text-muted-foreground group-hover:ar-spin-slow mr-1.5 size-3.5 group-hover:text-blue-400" />
          Refresh
        </Button>

        {/* RESET PREVIEW */}

        <Button
          type="button"
          variant="outline"
          onClick={handleResetPreview}
          disabled={isLoading}
          className="group border-border/50 h-9 text-[11px] font-bold shadow-sm transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
        >
          <RotateCcw className="text-muted-foreground group-hover:ar-shake mr-1.5 size-3.5 group-hover:text-red-400" />
          Reset
        </Button>
      </div>

      {/* ========================================================
          EXPORT
          ======================================================== */}

      <div className="grid w-full grid-cols-2 gap-3">
        {/* EXPORT PNG */}

        <Button
          type="button"
          variant="outline"
          onClick={() => handleDownload("png")}
          disabled={isLoading}
          className="group border-border/50 hover:border-primary/30 hover:bg-primary/10 hover:text-primary h-9 text-[11px] font-bold shadow-sm transition-colors"
        >
          <Download className="text-muted-foreground group-hover:text-primary group-hover:ar-bounce-x mr-1.5 size-3.5" />
          Export PNG
        </Button>

        {/* EXPORT SVG */}

        <Button
          type="button"
          variant="outline"
          onClick={() => handleDownload("svg")}
          disabled={isLoading}
          className="group border-border/50 hover:border-primary/30 hover:bg-primary/10 hover:text-primary h-9 text-[11px] font-bold shadow-sm transition-colors"
        >
          <Download className="text-muted-foreground group-hover:text-primary group-hover:ar-bounce-x mr-1.5 size-3.5" />
          Export SVG
        </Button>
      </div>
    </div>
  )
}
