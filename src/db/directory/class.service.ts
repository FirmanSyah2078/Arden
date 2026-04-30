// src/db/directory/class.service.ts
import { prisma } from "@/lib/prisma"

export class ClassService {
  static async getAllClasses() {
    const classes = await prisma.tbl_classes.findMany({
      include: {
        _count: { select: { tbl_students: true } }
      },
      orderBy: [
        { academic_year: 'desc' }, // Tahun ajaran terbaru di atas
        { grade_level: 'asc' },    // Kls 10 dulu, baru 11, 12
        { class_name: 'asc' }      // Baru abjad nama kelas (MIPA 1, MIPA 2)
      ]
    });

    return classes.map(cls => ({
      id_class: Number(cls.id_class),
      grade_level: cls.grade_level,
      class_name: cls.class_name,
      academic_year: cls.academic_year,
      advisor: cls.advisor,
      description: cls.description,
      total_students: cls._count.tbl_students
    }));
  }

  static async createClass(data: { grade_level: number | string; class_name: string; academic_year: string; advisor?: string; description?: string }) {
    const newClass = await prisma.tbl_classes.create({
      data: {
        grade_level: Number(data.grade_level),
        class_name: data.class_name.toUpperCase(),
        academic_year: data.academic_year,
        advisor: data.advisor || null,
        description: data.description || null
      }
    });
    return { ...newClass, id_class: Number(newClass.id_class) };
  }

  static async updateClass(id: number, data: { grade_level?: number | string; class_name?: string; academic_year?: string; advisor?: string; description?: string }) {
    const payload: any = {};
    if (data.grade_level) payload.grade_level = Number(data.grade_level);
    if (data.class_name) payload.class_name = data.class_name.toUpperCase();
    if (data.academic_year) payload.academic_year = data.academic_year;
    if (data.advisor !== undefined) payload.advisor = data.advisor;
    if (data.description !== undefined) payload.description = data.description;

    const updated = await prisma.tbl_classes.update({
      where: { id_class: id },
      data: payload
    });
    return { ...updated, id_class: Number(updated.id_class) };
  }

  static async deleteClassWithStudents(id: number) {
    await prisma.$transaction([
      prisma.tbl_students.deleteMany({ where: { id_class: id } }),
      prisma.tbl_classes.delete({ where: { id_class: id } })
    ]);
    return true;
  }
}