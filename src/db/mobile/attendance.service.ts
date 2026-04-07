import { prisma } from "@/lib/prisma"

export class MobileAttendanceService {
  // A. Ambil Riwayat Hari Ini
  static async getTodayHistory(date: string, time: string) {
    const data = await prisma.tbl_attendance.findMany({
      where: {
        date: new Date(date),
        time: time
      },
      include: {
        tbl_students: {
          select: { full_name: true, nis: true, tbl_classes: { select: { class_name: true } } }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    return data.map(d => ({ ...d, id_attendance: Number(d.id_attendance) }));
  }

  // B. Simpan Absensi Baru
  static async submitAttendance(payload: any) {
    const { id_student, time, status, remarks, method, date } = payload;
    
    const existing = await prisma.tbl_attendance.findFirst({
      where: { id_student: Number(id_student), date: new Date(date), time: time }
    });

    if (existing) throw new Error(`Siswi ini sudah absen ${time} hari ini.`);

    // Logika Saklek Mobile: Kalau SCAN, pasti Haid dan tanpa keterangan
    const finalMethod = method || 'SCAN';
    const finalStatus = finalMethod === 'SCAN' ? 'Haid' : status;
    const finalRemarks = finalMethod === 'SCAN' ? null : remarks;

    const newAttendance = await prisma.tbl_attendance.create({
      data: {
        id_student: Number(id_student),
        date: new Date(date),
        time: time,
        status: finalStatus,
        method: finalMethod,
        remarks: finalRemarks,
      }
    });

    return { ...newAttendance, id_attendance: Number(newAttendance.id_attendance) };
  }
}