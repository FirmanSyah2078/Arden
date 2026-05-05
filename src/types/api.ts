// src/types/api.ts

// ==========================================
// 1. TYPE DEFINITIONS UTAMA (DASHBOARD & CORE)
// ==========================================

// Role sesuai Database Utama
export type Role = 'Admin' | 'Pemantau' | 'Pelaksana';

// Status API standar
export type Status = 'success' | 'fail' | 'idle' | 'loading' | 'error';

export interface LoginData {
    token: string;
    name: string;
    role: Role;
    photo_url: string | null;
    last_login: string; 
}

export interface ApiResponse<T> {
    code: number;
    status: Status;
    message: string;
    data: T | null;
    error: string | null;
}

// Class Helper untuk Response API
export class ApiSuccess<T> implements ApiResponse<T> {
    readonly code: number;
    readonly status = 'success' as const; 
    readonly message: string;
    readonly data: T;
    readonly error = null; 

    constructor(message: string, data: T, code: number = 200) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}

export class ApiFail<T> implements ApiResponse<T> {
    readonly code: number;
    readonly status = 'fail' as const; 
    readonly message: string;
    readonly data = null; 
    readonly error: string;

    constructor(message: string, error: string, code: number = 400) {
        this.code = code;
        this.message = message;
        this.error = error;
    }
}

// Tipe Data Student untuk Dashboard (Lengkap - Sesuai Schema Baru)
export interface Student {
  id_student: number;
  icode: string;
  nis: string;
  full_name: string;
  id_class: number | null;
  period_status: string | null;
  notes: string | null;
  tbl_classes?: {
    class_name: string;
  };
}

export interface User {
  id_user: number;
  name: string;
  username: string;
  role: Role;
  last_login: string | null;
  photo_url: string | null;
  is_active: boolean;
  is_online: boolean;
  created_at?: string | null;
  email?: string | null;
}

export interface Class {
  id_class: number;
  grade_level: number;       // 🔥 BARU
  class_name: string;
  academic_year: string;     // 🔥 BARU
  advisor: string | null;
  description: string | null;
}


// ==========================================
// 2. TYPE DEFINITIONS INTEGRASI MOBILE
// ==========================================

// Jadwal Sholat (Slot waktu yang didukung sistem absensi ARDEN saat ini)
export type PrayerTimeSlot = 'Dhuhr' | 'Asr';

// Daftar Sholat Lima Waktu
export type DailyPrayer = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'; 

export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

// Status Khusus Absensi
export type AttendanceType = 'Haid' | 'Suci';

// [INTEGRASI] Student versi Mobile (Sederhana)
export interface StudentMobile { 
  id_student: string | number;
  icode: string;
  full_name: string;
  nis: string;
  class_name: string;
}

// Struktur Data untuk QR Code / Status Absensi
export interface AttendanceStatusResponse { 
  id: string;
  full_name: string;
  nis: string;
  class_name: string;
  status: Status; 
  message: string;
  icode?: string;
  remarks?: string;
}

// Payload untuk Input Absensi Baru (Mobile)
export interface NewAttendancePayload { 
  id_student?: number;
  nis?: string;
  date: Date | string;
  time: string;
  status: AttendanceType; 
  method?: 'SCAN' | 'MANUAL'; 
  remarks: string;
  created_at: Date | string;
}

// Data Absensi yang ditampilkan di History Mobile
export interface AttendanceDataMobile {
  id_attendance: number;
  date: Date | string;
  time: PrayerTimeSlot | string;
  status: Status | string;
  remarks: string | null;
  created_at: string;
  tbl_students: {
      full_name: string;
      class_name: string;
      nis: string;
  };
}

// ==========================================
// 3. TYPE DEFINITIONS CONFIGURATION (ARDEN)
// ==========================================

// 🔥 FIX TIME BOMB: Menggunakan snake_case mutlak sesuai skema Prisma
export interface PeriodSettingsData {
  min_duration: number;
  standard_duration: number;
  max_duration: number;
  over_limit: number;
}

export interface CommunicationSettingsData {
  isNotificationActive: boolean;
  warningMessage: string;
}

export interface DayScheduleData {
  day: string;
  isActive: boolean;
  trackedPrayers: DailyPrayer[];
}

// ==========================================
// 4. TYPE DEFINITIONS PRAYER CACHE
// ==========================================
export interface PrayerCacheData {
  date: string; // Format YYYY-MM-DD
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

// ==========================================
// 5. TYPE DEFINITIONS GLOBALS (ARDEN CONFIG)
// ==========================================

// --- A. Geographic Core ---
export interface GeographicSettingsData {
  id_setting?: number;
  country: string;
  city: string;
  timezone: string;
  method: string;
  is_api_active?: boolean;
}

// --- B. Generator Engine (QR Code) ---
export type QRShape = "square" | "circle";
export type QRErrorCorrectionLevel = "L" | "M" | "Q" | "H";
export type QRDotType = "square" | "dots" | "rounded" | "extra-rounded" | "classy" | "classy-rounded";
export type QRCornerSquareType = "dot" | "square" | "extra-rounded" | "rounded" | "classy" | "classy-rounded";
export type QRCornerDotType = "dot" | "square";

export interface GeneratorSettingsData {
  qrShape: QRShape;
  qrColor: string;
  bgColor: string;
  isBgTransparent: boolean;
  qrPattern: QRDotType;
  errorLevel: QRErrorCorrectionLevel;
  cornerSquare: QRCornerSquareType;
  cornerSquareColor: string;
  cornerDot: QRCornerDotType;
  cornerDotColor: string;
  isCustomColor: boolean;
  qrIcon: string;
  imageSize: number;
  iconMargin: number;
  hideDotsBg: boolean;
}