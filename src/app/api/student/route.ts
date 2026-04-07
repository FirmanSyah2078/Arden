// src/app/api/student/route.ts
import { NextResponse } from 'next/server';
import { StudentService } from '@/db/dashboard/directory/student.service'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const icode = searchParams.get('icode');

    if (icode) {
      const data = await StudentService.getStudentByCode(icode);
      return NextResponse.json({ status: 'success', data });
    } else {
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
    if (!body.id_student) return NextResponse.json({ status: 'fail', message: 'ID diperlukan' }, { status: 400 }); // 🔥 FIX
    
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