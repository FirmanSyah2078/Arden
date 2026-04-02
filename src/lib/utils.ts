import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper kecil untuk error handling (boleh di sini karena aman untuk client/server)
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

// 🔥 FUNGSI GLOBAL BARU: Ambil 1 huruf saja untuk inisial
export function getInitials(name?: string): string {
  if (!name) return "?"; 
  return name.trim().charAt(0).toUpperCase();
}