import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DailyPrayer } from "@/types/api" // 🔥 FIX: Import DailyPrayer

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface IError {
  code: number;
  status: string;
  message: string;
  error: string;
}

export function isIError(err: unknown): err is IError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    'status' in err &&
    'error' in err &&
    'message' in err
  );
}

export function getInitials(name?: string): string {
  if (!name) return "?"; 
  return name.trim().charAt(0).toUpperCase();
}

export function getTodayDate() {
  const now = new Date();
  return {
    day: new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(now),
    date: now.getDate(),
    month: new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(now),
    year: now.getFullYear(),
    fullDateString: `${new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(now)}, ${now.getDate()} ${new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(now)} ${now.getFullYear()}`,
  };
}

export const formatDMY = (d: Date) => {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export function checkTimeShoolat(sholat: DailyPrayer): string {
  if (sholat === 'Dhuhr') return 'Dhuhr';
  if (sholat === 'Asr') return 'Asr';
  return 'NaV';
}