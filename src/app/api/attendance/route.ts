// src/app/api/attendance/route.ts
import { NextResponse } from 'next/server';
import { MobileAttendanceService } from '@/db/mobile/attendance.service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const timeFilter = searchParams.get('time'); // 'all', 'Dhuhr', 'Asr', dll.

    if (!date) throw new Error("Parameter 'date' diperlukan");

    const data = await MobileAttendanceService.getTodayHistory(date, timeFilter || "all");
    return NextResponse.json({ status: 'success', data: { absensi: data } });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = body.dtnew || body;

    const validWaktu = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    if (!validWaktu.includes(payload.time)) {
      throw new Error(`Invalid prayer session. Hanya menerima ${validWaktu.join(', ')}.`);
    }

    const data = await MobileAttendanceService.submitAttendance(payload);
    
    return NextResponse.json({ 
      status: 'success', 
      message: `Absen berhasil (Status Gatekeeper: ${data._gatekeeperStatus})`, 
      data 
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 400 });
  }
}