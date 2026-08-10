import {prisma} from '@/lib/prisma';
import {NextResponse} from 'next/server';

export async function GET(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const prm = searchParams.get('prm');
    const limit = Number(searchParams.get('limit')) || 15;

    if (!prm) {
      return NextResponse.json(
          {status: 'error', message: 'Parameter "prm" is required'},
          {status: 400});
    }

    const students = await prisma.tbl_students.findMany({
      where: {
        OR: [
          {full_name: {contains: prm, mode: 'insensitive'}},
          {nis: {contains: prm, mode: 'insensitive'}},
          {tbl_classes: {class_name: {contains: prm, mode: 'insensitive'}}},
        ],
      },
      take: limit,
      select: {
        id_student: true,
        full_name: true,
        nis: true,
        icode: true,
        tbl_classes: {
          select: {
            class_name: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: 'success',
      data: students,
    });
  } catch (error) {
    console.error('API /student error:', error);
    return NextResponse.json(
        {status: 'error', message: 'Internal server error'}, {status: 500});
  }
}