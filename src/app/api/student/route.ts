// src/app/api/student/route.ts
import { NextResponse } from 'next/server';
import { StudentService } from '@/db/dashboard/directory/student.service'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const icode = searchParams.get('icode');
    const prm = searchParams.get('prm'); // 🔥 Parameter search dari mode Manual
    const limit = parseInt(searchParams.get('limit') || '15'); // Limit default 15

    if (icode) {
      // Untuk Scanner QR
      const data = await StudentService.getStudentByCode(icode);
      return NextResponse.json({ status: 'success', data });
    } else if (prm) {
      // 🔥 Untuk Manual Input (Search Nama / NIS)
      const data = await StudentService.searchStudents(prm, limit);
      return NextResponse.json({ status: 'success', data });
    } else {
      // Untuk Dashboard Table (AMAN)
      const data = await StudentService.getAllStudents();
      return NextResponse.json({ status: 'success', data });
    }
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: err.message.includes('ditemukan') ? 404 : 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await StudentService.createStudent(body);
    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id_student) return NextResponse.json({ status: 'fail', message: 'ID diperlukan' }, { status: 400 }); 
    const data = await StudentService.updateStudent(Number(body.id_student), body);
    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ status: 'fail', message: 'ID diperlukan' }, { status: 400 });

    await StudentService.deleteStudent(Number(id));
    return NextResponse.json({ status: 'success', message: 'Data berhasil dihapus' });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}