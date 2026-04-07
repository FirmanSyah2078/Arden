// src/app/api/student/import/route.ts
import { NextResponse } from 'next/server';
import { StudentService } from '@/db/dashboard/directory/student.service'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!Array.isArray(body)) {
      return NextResponse.json({ status: 'fail', message: 'Data harus berupa array' }, { status: 400 });
    }

    // Panggil Service Import
    const count = await StudentService.importStudents(body);

    return NextResponse.json({ status: 'success', count });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}