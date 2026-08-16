// src/lib/qr/arden-qr-engine.ts

import type {
  GeneratorSettingsData,
  QRShape,
  QRDotType,
  QRErrorCorrectionLevel,
  QRCornerSquareType,
  QRCornerDotType,
} from "@/types/api"

type QRFormat = "png" | "svg"

interface QRCodeStylingLike {
  append(container: HTMLElement): void

  update(options: unknown): void

  download(options: { name: string; extension: QRFormat }): Promise<void>

  getRawData(extension: QRFormat): Promise<Blob | null>
}

type QRCodeStylingConstructor = new (options: unknown) => QRCodeStylingLike

export interface ArdenQREngineSize {
  width: number
  height: number
}

export interface ArdenQREngineGenerateOptions {
  /**
   * Output size.
   *
   * This belongs to the consumer/layout layer,
   * NOT to the master QR design.
   */
  width?: number
  height?: number

  /**
   * Optional configuration override.
   *
   * Normally this should NOT be supplied by consumers.
   * Generator Studio uses this for live draft preview.
   */
  settings?: GeneratorSettingsData
}

/**
 * Arden QR Engine
 *
 * SINGLE SOURCE OF QR GENERATION.
 *
 * Responsibilities:
 * - Load master QR configuration
 * - Generate QR from arbitrary string payload
 * - Render QR to DOM
 * - Export PNG/SVG
 *
 * It does NOT decide:
 * - where QR is positioned
 * - how large it is in a card
 * - how large it is on a page
 *
 * Those belong to the consumer.
 */
export class ArdenQREngine {
  private qr: QRCodeStylingLike | null = null

  private mountedContainer: HTMLElement | null = null

  private currentPayload = ""

  private currentSettings: GeneratorSettingsData | null = null

  private readonly defaultSize: ArdenQREngineSize

  /**
   * Master configuration cache.
   *
   * This is shared between engine instances inside
   * the current browser session.
   */
  private static masterSettings: GeneratorSettingsData | null = null

  private static masterSettingsPromise: Promise<GeneratorSettingsData> | null =
    null

  constructor(
    size: ArdenQREngineSize = {
      width: 180,
      height: 180,
    }
  ) {
    this.defaultSize = size
  }

  // ============================================================
  // MASTER CONFIGURATION
  // ============================================================

  /**
   * Get the master QR design saved by Generator Engine Studio.
   *
   * Consumers normally do not need to call this manually.
   */
  static async getMasterSettings(
    forceRefresh = false
  ): Promise<GeneratorSettingsData> {
    if (!forceRefresh && ArdenQREngine.masterSettings) {
      return ArdenQREngine.masterSettings
    }

    if (!forceRefresh && ArdenQREngine.masterSettingsPromise) {
      return ArdenQREngine.masterSettingsPromise
    }

    ArdenQREngine.masterSettingsPromise = (async () => {
      const response = await fetch("/api/generate", {
        method: "GET",
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Failed to load Arden QR Engine configuration.")
      }

      const json = await response.json()

      if (json.status !== "success" || !json.data) {
        throw new Error(
          json.message || "Invalid QR Engine configuration response."
        )
      }

      const settings = json.data as GeneratorSettingsData

      ArdenQREngine.masterSettings = settings

      return settings
    })()

    try {
      return await ArdenQREngine.masterSettingsPromise
    } finally {
      ArdenQREngine.masterSettingsPromise = null
    }
  }

  /**
   * Clear browser-side master configuration cache.
   *
   * Generator Studio calls this after Save Engine.
   */
  static invalidateMasterSettings(): void {
    ArdenQREngine.masterSettings = null

    ArdenQREngine.masterSettingsPromise = null
  }

  // ============================================================
  // RENDERER
  // ============================================================

  private async loadRenderer(): Promise<QRCodeStylingConstructor> {
    if (typeof window === "undefined") {
      throw new Error("Arden QR Engine hanya dapat dijalankan di browser.")
    }

    const qrModule = await import("qr-code-styling")

    return qrModule.default as unknown as QRCodeStylingConstructor
  }

  // ============================================================
  // OPTION BUILDER
  // ============================================================

  private buildOptions(
    payload: string,
    settings: GeneratorSettingsData,
    size: ArdenQREngineSize
  ) {
    const backgroundColor = settings.isBgTransparent
      ? "transparent"
      : settings.bgColor || "#ffffff"

    return {
      width: size.width,

      height: size.height,

      type: "svg" as const,

      shape: settings.qrShape as QRShape,

      data: payload,

      image: settings.qrIcon || "",

      qrOptions: {
        errorCorrectionLevel: settings.errorLevel as QRErrorCorrectionLevel,
      },

      dotsOptions: {
        color: settings.mainDotColor || settings.qrColor || "#000000",

        type: settings.qrPattern as QRDotType,
      },

      backgroundOptions: {
        color: backgroundColor,
      },

      cornersSquareOptions: {
        type: settings.cornerSquare as QRCornerSquareType,

        color: settings.cornerSquareColor || settings.qrColor || "#000000",
      },

      cornersDotOptions: {
        type: settings.cornerDot as QRCornerDotType,

        color: settings.cornerDotColor || settings.qrColor || "#000000",
      },

      imageOptions: {
        crossOrigin: "anonymous",

        imageSize: settings.imageSize,

        margin: settings.iconMargin,

        hideBackgroundDots: settings.hideDotsBg ?? true,

        /**
         * Keep SVG logo output portable.
         */
        saveAsBlob: true,
      },
    }
  }

  // ============================================================
  // RENDER INTO DOM
  // ============================================================

  async render(
    container: HTMLElement,
    payload: string,
    settings?: GeneratorSettingsData,
    forceNew = false
  ): Promise<void> {
    const cleanPayload = payload.trim()

    this.mountedContainer = container

    this.currentPayload = cleanPayload

    if (!cleanPayload) {
      container.innerHTML = ""

      this.qr = null

      return
    }

    const effectiveSettings =
      settings || (await ArdenQREngine.getMasterSettings())

    this.currentSettings = effectiveSettings

    const options = this.buildOptions(
      cleanPayload,
      effectiveSettings,
      this.defaultSize
    )

    const QRCodeStyling = await this.loadRenderer()

    if (!this.qr || forceNew) {
      container.innerHTML = ""

      this.qr = new QRCodeStyling(options)

      this.qr.append(container)

      return
    }

    this.qr.update(options)
  }

  // ============================================================
  // GENERATE RAW OUTPUT
  // ============================================================

  /**
   * Generate a QR without mounting it into a DOM container.
   *
   * This is the main API intended for future consumers.
   *
   * Example:
   *
   * const blob =
   *   await engine.generate(student.icode, {
   *     width: 300,
   *     height: 300,
   *   });
   */
  async generate(
    payload: string,
    options: ArdenQREngineGenerateOptions = {}
  ): Promise<Blob> {
    const cleanPayload = payload.trim()

    if (!cleanPayload) {
      throw new Error("QR payload cannot be empty.")
    }

    const settings =
      options.settings || (await ArdenQREngine.getMasterSettings())

    const size: ArdenQREngineSize = {
      width: options.width || this.defaultSize.width,

      height: options.height || this.defaultSize.height,
    }

    const qrOptions = this.buildOptions(cleanPayload, settings, size)

    const QRCodeStyling = await this.loadRenderer()

    const qr = new QRCodeStyling(qrOptions)

    const output = await qr.getRawData("svg")

    if (!output) {
      throw new Error("Arden QR Engine menghasilkan output kosong.")
    }

    return output
  }

  // ============================================================
  // GET CURRENT RAW OUTPUT
  // ============================================================

  async getRawData(format: QRFormat): Promise<Blob> {
    if (!this.qr) {
      throw new Error("Arden QR Engine belum memiliki QR aktif.")
    }

    const output = await this.qr.getRawData(format)

    if (!output) {
      throw new Error("QR output kosong.")
    }

    return output
  }

  // ============================================================
  // DOWNLOAD
  // ============================================================

  async download(format: QRFormat, name = "ARDEN-QRCode"): Promise<void> {
    if (!this.qr) {
      throw new Error("Arden QR Engine belum memiliki QR aktif.")
    }

    await this.qr.download({
      name,
      extension: format,
    })
  }

  // ============================================================
  // REFRESH CURRENT ENGINE
  // ============================================================

  async refresh(): Promise<void> {
    if (!this.mountedContainer || !this.currentPayload) {
      return
    }

    await this.render(
      this.mountedContainer,
      this.currentPayload,
      this.currentSettings || undefined,
      true
    )
  }

  // ============================================================
  // DESTROY
  // ============================================================

  destroy(): void {
    if (this.mountedContainer) {
      this.mountedContainer.innerHTML = ""
    }

    this.qr = null

    this.mountedContainer = null

    this.currentPayload = ""

    this.currentSettings = null
  }
}

/**
 * Factory helper.
 *
 * Use this when a feature needs its own engine instance.
 */
export function createArdenQREngine(size?: ArdenQREngineSize): ArdenQREngine {
  return new ArdenQREngine(size)
}
