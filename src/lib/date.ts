// src/lib/date.ts

const TIMEZONE = "Asia/Jakarta";
const LOCALE = "id-ID"; // Teks UI tetap bahasa Indonesia (misal: "Senin", "Agustus")

/**
 * Validasi apakah input adalah tanggal yang valid.
 * Mencegah error "Invalid Date" yang bisa merusak UI.
 */
function isValidDate(date: any): boolean {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * Format tanggal dan waktu lengkap (Contoh: 17 Agustus 2024 14:30)
 * Cocok untuk detail riwayat atau log aktivitas.
 */
export function formatFullDateTime(isoString: string | Date | null): string {
  if (!isValidDate(isoString)) return "-";

  return new Date(isoString!).toLocaleString(LOCALE, {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace(/\./g, ':'); // Perbaikan separator titik bawaan JS untuk locale id-ID (14.30 -> 14:30)
}

/**
 * Format tanggal saja (Contoh: 17 Agustus 2024)
 * Bisa menyertakan nama hari jika parameter 'withDay' diset true.
 */
export function formatDate(isoString: string | Date | null, withDay: boolean = false): string {
  if (!isValidDate(isoString)) return "-";

  return new Date(isoString!).toLocaleDateString(LOCALE, {
    timeZone: TIMEZONE,
    weekday: withDay ? "long" : undefined, 
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format waktu/jam saja (Contoh: 14:30)
 * Cocok untuk list di mobile yang tanggalnya sudah jelas/diketahui.
 */
export function formatTime(isoString: string | Date | null): string {
  if (!isValidDate(isoString)) return "-";
  
  return new Date(isoString!).toLocaleTimeString(LOCALE, {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace(/\./g, ':');
}

/**
 * [BONUS] Pesan sapaan berdasarkan waktu lokal (WIB).
 * Cocok untuk teks di dashboard (misal: "Selamat Pagi, Admin").
 */
export function getGreeting(): string {
  const hour = parseInt(
    new Date().toLocaleTimeString("en-US", {
      timeZone: TIMEZONE,
      hour: "numeric",
      hour12: false,
    })
  );

  if (hour >= 4 && hour < 11) return "Selamat Pagi";
  if (hour >= 11 && hour < 15) return "Selamat Siang";
  if (hour >= 15 && hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

/**
 * [BONUS] Format waktu relatif (Contoh: "Baru saja", "5 menit yang lalu").
 * Bagus untuk notifikasi real-time atau riwayat aktivitas terbaru.
 */
export function formatRelativeTime(isoString: string | Date | null): string {
  if (!isValidDate(isoString)) return "-";

  const date = new Date(isoString!);
  const now = new Date();
  
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Baru saja";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  if (diffInSeconds < 172800) return "Kemarin";
  
  return formatDate(date);
}