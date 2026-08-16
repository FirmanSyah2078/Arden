// src/hooks/globals/use-generate.ts

import { useState, useEffect, useCallback, useMemo } from "react"

import { toast } from "sonner"

import imageCompression from "browser-image-compression"

import type { GeneratorSettingsData } from "@/types/api"

import { ArdenQREngine } from "@/lib/qr/arden-qr-engine"

// ============================================================
// DEFAULT GENERATOR CONFIGURATION
// ============================================================

const defaultSettings: GeneratorSettingsData = {
  qrShape: "square",

  // Global / fallback color
  qrColor: "#000000",

  bgColor: "#ffffff",
  isBgTransparent: true,

  qrPattern: "square",
  errorLevel: "Q",

  cornerSquare: "square",
  cornerSquareColor: "#000000",

  cornerDot: "square",
  cornerDotColor: "#000000",

  // Advanced Colors
  mainDotColor: "#000000",

  isCustomColor: false,

  qrIcon: "",
  imageSize: 0.4,
  iconMargin: 5,
  hideDotsBg: true,
}

// ============================================================
// HOOK
// ============================================================

export function useGenerate() {
  // ----------------------------------------------------------
  // CURRENT DRAFT CONFIGURATION
  // ----------------------------------------------------------

  const [settings, setSettings] =
    useState<GeneratorSettingsData>(defaultSettings)

  // ----------------------------------------------------------
  // LAST SAVED MASTER CONFIGURATION
  // ----------------------------------------------------------

  const [savedSettings, setSavedSettings] =
    useState<GeneratorSettingsData>(defaultSettings)

  // ----------------------------------------------------------
  // PENDING IMAGE UPLOAD
  // ----------------------------------------------------------

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // ----------------------------------------------------------
  // UI STATE
  // ----------------------------------------------------------

  const [isLoading, setIsLoading] = useState(true)

  const [isSaving, setIsSaving] = useState(false)

  // ==========================================================
  // LOAD MASTER CONFIGURATION
  // ==========================================================

  const loadSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/generate", {
        method: "GET",
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Failed to load generator settings.")
      }

      const json = await response.json()

      if (json.status !== "success" || !json.data) {
        throw new Error(json.message || "Invalid generator settings response.")
      }

      // ----------------------------------------------------
      // BACKGROUND NORMALIZATION
      // ----------------------------------------------------
      //
      // Database tetap menyimpan HEX.
      //
      // isBgTransparent menentukan apakah QR benar-benar
      // transparent.
      //
      // Jadi input color selalu mendapatkan HEX valid.
      // ----------------------------------------------------

      const dbBgColor = json.data.bgColor

      const isTransparent =
        dbBgColor === "transparent" || Boolean(json.data.isBgTransparent)

      const safeBgColor =
        dbBgColor === "transparent" || !dbBgColor ? "#ffffff" : dbBgColor

      const serverData: GeneratorSettingsData = {
        ...defaultSettings,

        ...json.data,

        isBgTransparent: isTransparent,

        bgColor: safeBgColor,
      }

      setSettings(serverData)

      setSavedSettings(serverData)

      // ----------------------------------------------------
      // SYNCHRONIZE ENGINE CACHE
      // ----------------------------------------------------

      ArdenQREngine.invalidateMasterSettings()

      await ArdenQREngine.getMasterSettings()
    } catch (error) {
      console.error("Generator settings load failed:", error)

      toast.error("Failed to load Generator Engine configuration.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  // ==========================================================
  // CHANGE MASTER SETTINGS
  // ==========================================================

  const handleChange = (
    field: keyof GeneratorSettingsData,
    value: string | boolean | number
  ) => {
    setSettings((previous) => {
      const next = {
        ...previous,
        [field]: value,
      }

      // ------------------------------------------------------
      // TRANSPARENT BACKGROUND
      // ------------------------------------------------------

      if (field === "isBgTransparent" && value === true) {
        next.bgColor = savedSettings.bgColor
      }

      // ------------------------------------------------------
      // Logo requires stronger error correction.
      // ------------------------------------------------------

      if (field === "qrIcon" && value !== "") {
        if (next.errorLevel === "L" || next.errorLevel === "M") {
          next.errorLevel = "Q"

          toast.info("Error Correction locked to 'Q' to support image.", {
            duration: 2000,
          })
        }
      }

      // ------------------------------------------------------
      // ADVANCED COLORS OFF
      //
      // Global QR Color kembali menjadi satu-satunya
      // sumber warna untuk seluruh komponen QR.
      // ------------------------------------------------------

      if (field === "isCustomColor" && value === false) {
        next.mainDotColor = next.qrColor

        next.cornerSquareColor = next.qrColor

        next.cornerDotColor = next.qrColor
      }

      // ------------------------------------------------------
      // GLOBAL QR COLOR
      //
      // Saat Advanced Colors OFF:
      // Global menjadi master color.
      //
      // Saat Advanced Colors ON:
      // Global berdiri sendiri dan TIDAK menyentuh
      // Advanced Colors.
      // ------------------------------------------------------

      if (field === "qrColor" && !next.isCustomColor) {
        next.mainDotColor = value as string

        next.cornerSquareColor = value as string

        next.cornerDotColor = value as string
      }

      // ------------------------------------------------------
      // Remove selected file when logo is removed.
      // ------------------------------------------------------

      if (field === "qrIcon" && value === "") {
        setSelectedFile(null)
      }

      return next
    })
  }

  // ==========================================================
  // IMAGE UPLOAD
  // ==========================================================

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    // ------------------------------------------------------
    // MAX INPUT SIZE
    // ------------------------------------------------------

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image is too large. Max 2MB allowed.")

      event.target.value = ""

      return
    }

    const toastId = toast.loading("Compressing and analyzing image...")

    try {
      const options = {
        maxSizeMB: 0.2,

        maxWidthOrHeight: 512,

        useWebWorker: true,
      }

      const compressedFile = await imageCompression(file, options)

      const previewUrl = URL.createObjectURL(compressedFile)

      // ----------------------------------------------------
      // PREVIEW URL
      // ----------------------------------------------------

      handleChange("qrIcon", previewUrl)

      // ----------------------------------------------------
      // STORE FILE FOR SAVE
      // ----------------------------------------------------

      setSelectedFile(compressedFile)

      toast.success("Image preview ready!", {
        id: toastId,
        duration: 1500,
      })
    } catch (error) {
      console.error("Image compression failed:", error)

      toast.error("Image compression failed.", {
        id: toastId,
      })
    }
  }

  // ==========================================================
  // SAVE MASTER ENGINE
  // ==========================================================

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()

    setIsSaving(true)

    let finalIconUrl = settings.qrIcon

    try {
      // ----------------------------------------------------
      // UPLOAD NEW LOGO
      // ----------------------------------------------------

      if (selectedFile) {
        const formData = new FormData()

        formData.append("file", selectedFile)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const uploadJson = await uploadResponse.json()

        if (!uploadResponse.ok || uploadJson.status !== "success") {
          throw new Error(uploadJson.message || "Logo upload failed.")
        }

        finalIconUrl = uploadJson.data.url

        // --------------------------------------------------
        // DELETE OLD LOGO
        // --------------------------------------------------

        if (savedSettings.qrIcon && savedSettings.qrIcon.startsWith("http")) {
          await fetch(
            `/api/upload?url=${encodeURIComponent(savedSettings.qrIcon)}`,
            {
              method: "DELETE",
            }
          )
        }
      }

      // ----------------------------------------------------
      // DELETE EXISTING LOGO
      // ----------------------------------------------------
      else if (
        settings.qrIcon === "" &&
        savedSettings.qrIcon &&
        savedSettings.qrIcon.startsWith("http")
      ) {
        await fetch(
          `/api/upload?url=${encodeURIComponent(savedSettings.qrIcon)}`,
          {
            method: "DELETE",
          }
        )

        finalIconUrl = ""
      }

      // ----------------------------------------------------
      // PREPARE MASTER CONFIGURATION
      // ----------------------------------------------------

      const dataToSave: GeneratorSettingsData = {
        ...settings,

        qrIcon: finalIconUrl,
      }

      // ----------------------------------------------------
      // PERSIST TO DATABASE
      // ----------------------------------------------------

      const response = await fetch("/api/generate", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(dataToSave),
      })

      const json = await response.json()

      if (!response.ok || json.status !== "success") {
        throw new Error(json.message || "Failed to save Generator Engine.")
      }

      // ----------------------------------------------------
      // UPDATE LOCAL MASTER STATE
      // ----------------------------------------------------

      setSettings(dataToSave)

      setSavedSettings(dataToSave)

      setSelectedFile(null)

      // ----------------------------------------------------
      // IMPORTANT
      // ----------------------------------------------------
      //
      // Saved Studio configuration menjadi Master QR
      // configuration untuk consumer Arden berikutnya.
      // ----------------------------------------------------

      ArdenQREngine.invalidateMasterSettings()

      await ArdenQREngine.getMasterSettings()

      toast.success("Generator Engine saved successfully.", {
        duration: 2000,
      })
    } catch (error) {
      console.error("Generator save failed:", error)

      toast.error(
        `Failed to save: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    } finally {
      setIsSaving(false)
    }
  }

  // ==========================================================
  // DRAFT DETECTION
  // ==========================================================

  const isDraftModified = useMemo(() => {
    return (
      JSON.stringify(settings) !== JSON.stringify(savedSettings) ||
      selectedFile !== null
    )
  }, [settings, savedSettings, selectedFile])

  // ==========================================================
  // PUBLIC HOOK API
  // ==========================================================
  //
  // PERHATIKAN:
  //
  // Tidak ada lagi:
  //
  // - previewPayload
  // - setPreviewPayload
  // - qrRef
  // - qrCode
  // - forceRefresh
  // - resetToDefault
  // - handleDownload
  //
  // Semua itu sekarang milik Preview Workspace.
  // ==========================================================

  return {
    settings,

    isLoading,

    isSaving,

    isDraftModified,

    handleChange,

    handleImageUpload,

    handleSave,
  }
}
