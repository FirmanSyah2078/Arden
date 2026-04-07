// src/db/dashboard/directory/class.service.ts
import { prisma } from "@/lib/prisma"

export class ClassService {
  // Ambil semua kelas + jumlah siswinya
  static async getAllClasses() {
    const classes = await prisma.tbl_classes.findMany({ // 🔥 FIX: tbl_kelas -> tbl_classes
      include: {
        _count: {
          select: { tbl_students: true } // 🔥 FIX: tbl_siswi -> tbl_students
        }
      },
      orderBy: { class_name: 'asc' } // 🔥 FIX
    });

    // Format output & ubah BigInt Prisma menjadi Number agar aman saat di-JSON-kan
    return classes.map(cls => ({
      id_class: Number(cls.id_class),
      class_name: cls.class_name,
      advisor: cls.advisor,
      total_students: cls._count.tbl_students // 🔥 FIX
    }));
  }

  static async createClass(data: { class_name: string; advisor?: string }) { // 🔥 FIX
    const newClass = await prisma.tbl_classes.create({
      data: {
        class_name: data.class_name.toUpperCase(),
        advisor: data.advisor || null
      }
    });
    return { ...newClass, id_class: Number(newClass.id_class) };
  }

  static async updateClass(id: number, data: { class_name?: string; advisor?: string }) { // 🔥 FIX
    const payload: any = {};
    if (data.class_name) payload.class_name = data.class_name.toUpperCase();
    if (data.advisor !== undefined) payload.advisor = data.advisor;

    const updated = await prisma.tbl_classes.update({
      where: { id_class: id },
      data: payload
    });
    return { ...updated, id_class: Number(updated.id_class) };
  }

  static async deleteClassWithStudents(id: number) {
    // Prisma Transaction: Hapus siswi dulu, baru hapus kelasnya (Aman & Atomik)
    await prisma.$transaction([
      prisma.tbl_students.deleteMany({ where: { id_class: id } }), // 🔥 FIX
      prisma.tbl_classes.delete({ where: { id_class: id } }) // 🔥 FIX
    ]);
    return true;
  }
}