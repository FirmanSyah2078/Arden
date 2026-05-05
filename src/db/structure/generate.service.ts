import { prisma } from "@/lib/prisma";
import { GeneratorSettingsData, QRShape, QRDotType, QRErrorCorrectionLevel, QRCornerSquareType, QRCornerDotType } from "@/types/api";

export class GenerateService {
  // --- 1. GET DATA ---
  static async getGenerate(): Promise<GeneratorSettingsData> {
    let settings = await prisma.tbl_qr_generator.findFirst();

    // Auto-seed (Self-Healing) jika tabel tidak sengaja terhapus
    if (!settings) {
      settings = await prisma.tbl_qr_generator.create({ data: { id_setting: 1 } });
    }

    // Mapping: DB (snake_case) -> Frontend (camelCase)
    return {
      qrShape: settings.qr_shape as QRShape,
      qrColor: settings.qr_color,
      bgColor: settings.bg_color,
      isBgTransparent: settings.is_bg_transparent,
      qrPattern: settings.qr_pattern as QRDotType,
      errorLevel: settings.error_level as QRErrorCorrectionLevel,
      cornerSquare: settings.corner_square as QRCornerSquareType,
      cornerSquareColor: settings.corner_square_color,
      cornerDot: settings.corner_dot as QRCornerDotType,
      cornerDotColor: settings.corner_dot_color,
      isCustomColor: settings.is_custom_color,
      qrIcon: settings.qr_icon || "",
      imageSize: settings.image_size,
      iconMargin: settings.icon_margin,
      hideDotsBg: settings.hide_dots_bg,
    };
  }

  // --- 2. UPDATE DATA (UPSERT) ---
  static async updateGenerate(data: GeneratorSettingsData) {
    // Mapping: Frontend (camelCase) -> DB (snake_case)
    const payload = {
      qr_shape: data.qrShape,
      qr_color: data.qrColor,
      bg_color: data.bgColor,
      is_bg_transparent: data.isBgTransparent,
      qr_pattern: data.qrPattern,
      error_level: data.errorLevel,
      corner_square: data.cornerSquare,
      corner_square_color: data.cornerSquareColor,
      corner_dot: data.cornerDot,
      corner_dot_color: data.cornerDotColor,
      is_custom_color: data.isCustomColor,
      qr_icon: data.qrIcon,
      image_size: data.imageSize,
      icon_margin: data.iconMargin,
      hide_dots_bg: data.hideDotsBg,
    };

    // Gunakan Upsert agar ID: 1 selalu dipertahankan
    const updated = await prisma.tbl_qr_generator.upsert({
      where: { id_setting: 1 },
      update: payload,
      create: { id_setting: 1, ...payload }
    });

    return updated;
  }
}