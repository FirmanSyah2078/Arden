import { NextResponse } from 'next/server';
import { MobileAttendanceService } from '@/db/mobile/attendance.service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const time = searchParams.get('time');

    if (!date || !time) throw new Error("Parameter date dan time diperlukan");

    const data = await MobileAttendanceService.getTodayHistory(date, time);
    return NextResponse.json({ status: 'success', data: { absensi: data } });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = body.dtnew || body;

    // 🔥 FIX: Sesuaikan dengan 5 Waktu
    const validWaktu = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    if (!validWaktu.includes(payload.time)) {
      throw new Error(`Invalid prayer session. Hanya menerima ${validWaktu.join(', ')}.`);
    }

    const data = await MobileAttendanceService.submitAttendance(payload);
    return NextResponse.json({ status: 'success', message: 'Absen berhasil', data });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 400 });
  }
}