// src/db/mobile/attendance.service.ts
import { prisma } from "@/lib/prisma"

export class MobileAttendanceService {
  // A. Ambil Riwayat Hari Ini (Untuk Gatekeeper Dashboard)
  static async getTodayHistory(date: string, timeFilter?: string) {
    const whereClause: any = { date: new Date(date) };
    if (timeFilter && timeFilter !== "all") {
      whereClause.time = timeFilter;
    }

    const data = await prisma.tbl_attendance.findMany({
      where: whereClause,
      include: {
        tbl_students: {
          select: { full_name: true, nis: true, tbl_classes: { select: { class_name: true } } }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    return data.map(d => ({ ...d, id_attendance: Number(d.id_attendance) }));
  }

  // B. Simpan Absensi Baru (Mesin Validasi Utama Gatekeeper)
  static async submitAttendance(payload: any) {
    const { id_student, time: requestedSession, status, remarks, method, executor } = payload;
    
    // 1. AMBIL ZONA WAKTU DARI KONFIGURASI GEOGRAFIS
    const geoSettings = await prisma.tbl_geographic.findFirst();
    const systemTimezone = geoSettings?.timezone || "Asia/Jakarta";

    // 2. SINKRONISASI WAKTU LOKAL MUTLAK
    const now = new Date();
    
    // Memaksa pengambilan Jam & Menit sesuai zona waktu yang dikonfigurasi
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: systemTimezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const currentHourMin = timeFormatter.format(now); // Contoh: "15:30"

    // Memaksa pengambilan Tanggal, Bulan, Tahun sesuai zona waktu yang dikonfigurasi
    // (Penting! Mencegah bug pergantian hari saat Server UTC berbeda dengan Lokal)
    const tzOptions = { timeZone: systemTimezone };
    const localYear = new Intl.DateTimeFormat('en-US', { ...tzOptions, year: 'numeric' }).format(now);
    const localMonth = new Intl.DateTimeFormat('en-US', { ...tzOptions, month: 'numeric' }).format(now);
    const localDay = new Intl.DateTimeFormat('en-US', { ...tzOptions, day: 'numeric' }).format(now);

    const todayZeroHour = new Date(Number(localYear), Number(localMonth) - 1, Number(localDay));

    // 3. CEK WEEKLY TRACKING ROUTINE
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // Ambil index hari berdasarkan tanggal lokal, BUKAN tanggal server
    const localDayIndex = todayZeroHour.getDay(); 
    const currentDayName = dayNames[localDayIndex];

    const routine = await prisma.tbl_routine.findUnique({
      where: { day_name: currentDayName }
    });

    if (!routine || !routine.is_active) {
      throw new Error(`System is offline today (${currentDayName}). No tracking required.`);
    }

    const isSessionActive = 
      (requestedSession === "Fajr" && routine.track_fajr) ||
      (requestedSession === "Dhuhr" && routine.track_dhuhr) ||
      (requestedSession === "Asr" && routine.track_asr) ||
      (requestedSession === "Maghrib" && routine.track_maghrib) ||
      (requestedSession === "Isha" && routine.track_isha);

    if (!isSessionActive) {
      throw new Error(`The ${requestedSession} session is not active for today (${currentDayName}).`);
    }

    // 4. CEK BATAS WAKTU (PRAYER CACHE)
    const cache = await prisma.tbl_prayers.findUnique({
      where: { date: todayZeroHour }
    });

    if (!cache) {
      throw new Error("Missing today's schedule cache. Please run sync from the Bridges page.");
    }

    const sessionTimeStr = cache[requestedSession.toLowerCase() as keyof typeof cache] as string;
    
    const getMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return (h * 60) + m;
    };

    const sessionMins = getMinutes(sessionTimeStr);
    const nowMins = getMinutes(currentHourMin);
    const diffMins = nowMins - sessionMins;

    // 5. LOGIKA GATEKEEPER (JENDELA WAKTU 20 & 60 MENIT)
    let validatedStatus = "";
    
    if (diffMins < 0) {
      throw new Error(`The ${requestedSession} session has not started yet. Starts at ${sessionTimeStr}.`);
    }

    if (diffMins <= 20) {
      validatedStatus = "Normal";
    } else if (diffMins <= 60) {
      if (method !== "Manual") {
        throw new Error(`QR Scanner is closed. Elapsed +20mins. Proceed with Manual input.`);
      }
      validatedStatus = "Late";
    } else {
      throw new Error(`The ${requestedSession} session is permanently closed (Elapsed +60mins).`);
    }

    // 6. CEK DATA GANDA
    const existing = await prisma.tbl_attendance.findFirst({
      where: { id_student: Number(id_student), date: todayZeroHour, time: requestedSession }
    });

    if (existing) throw new Error(`Student has already checked in for ${requestedSession} today.`);

    // 7. PENYESUAIAN METODE & STATUS
    const finalMethod = method || 'Scan QR';
    const finalStatus = finalMethod === 'Scan QR' ? 'Haid' : status;
    const finalRemarks = remarks || "-";

    // 8. SIMPAN KE DATABASE
    const newAttendance = await prisma.tbl_attendance.create({
      data: {
        id_student: Number(id_student),
        date: todayZeroHour,
        time: requestedSession,
        status: finalStatus,
        method: finalMethod,
        remarks: finalRemarks,
      }
    });

    return { 
      ...newAttendance, 
      id_attendance: Number(newAttendance.id_attendance),
      _gatekeeperStatus: validatedStatus 
    };
  }
}