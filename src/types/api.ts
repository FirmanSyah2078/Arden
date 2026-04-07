// src/types/api.ts

// ==========================================
// 1. TYPE DEFINITIONS UTAMA (DASHBOARD & CORE)
// ==========================================

// Role sesuai Database Utama
export type Role = 'Admin' | 'Pemantau' | 'Pelaksana';

// Status API standar
export type Status = 'success' | 'fail';

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
  class_name: string;
  advisor: string | null;
  description: string | null;
}


// ==========================================
// 2. TYPE DEFINITIONS INTEGRASI MOBILE
// ==========================================

// Jadwal Sholat (Slot waktu yang didukung sistem absensi ARDEN saat ini)
export type PrayerTimeSlot = 'zhuhur' | 'ashar'; // 🔥 FIX: Typo 'dzuhur' diperbaiki menjadi 'zhuhur'

// Daftar Sholat Lima Waktu
export type DailyPrayer = 'Subuh' | 'Zhuhur' | 'Ashar' | 'Maghrib' | 'Isya'; // 🔥 FIX: Menggunakan nama lokal & perbaikan typo

export interface PrayerTimes {
  Subuh: string;
  Zhuhur: string;
  Ashar: string;
  Maghrib: string;
  Isya: string;
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