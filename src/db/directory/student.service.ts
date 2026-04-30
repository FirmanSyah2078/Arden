// src/db/directory/student.service.ts
import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"

export class StudentService {
  private static toTitleCase = (str: string) => {
    if (!str) return "";
    return str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
  }

  private static toCanonicalKey = (str: string) => {
    if (!str) return "";
    return str.toString().toUpperCase().replace(/[^A-Z0-9]/g, ''); 
  }

  private static generateIcode = () => {
    return `ARD-${randomUUID().split('-')[0].toUpperCase()}`;
  }

  // --- 1. AMBIL SEMUA DATA (DASHBOARD) ---
  static async getAllStudents() {
    const students = await prisma.tbl_students.findMany({
      include: { 
        tbl_classes: { 
          select: { class_name: true, grade_level: true } // 🔥 Pastikan ambil grade
        } 
      },
      orderBy: [ { id_class: 'asc' }, { full_name: 'asc' } ]
    });
    
    return students.map(s => ({ 
      ...s, 
      id_student: Number(s.id_student), 
      id_class: s.id_class ? Number(s.id_class) : null,
      // 🔥 Biarkan object aslinya terlempar agar dirakit oleh UI
      tbl_classes: s.tbl_classes ? { 
        class_name: s.tbl_classes.class_name,
        grade_level: s.tbl_classes.grade_level 
      } : undefined
    }));
  }

  // --- 2. AMBIL 1 DATA BY ICODE/NIS (MOBILE SCANNER) ---
  static async getStudentByCode(code: string) {
    const student = await prisma.tbl_students.findFirst({
      where: { OR: [ { icode: code }, { nis: code } ] },
      include: { tbl_classes: { select: { class_name: true, grade_level: true } } }
    });
    if (!student) throw new Error("Data student tidak ditemukan");
    
    return { 
      ...student, 
      id_student: Number(student.id_student), 
      id_class: student.id_class ? Number(student.id_class) : null 
    };
  }

  // --- 3. PENCARIAN MANUAL MOBILE (NAMA / NIS) ---
  static async searchStudents(prm: string, limit: number) {
    const students = await prisma.tbl_students.findMany({
      where: {
        OR: [
          { full_name: { contains: prm, mode: 'insensitive' } }, 
          { nis: { contains: prm } } 
        ]
      },
      take: limit,
      include: { tbl_classes: { select: { class_name: true, grade_level: true } } },
      orderBy: { full_name: 'asc' }
    });

    return students.map(s => ({ 
      ...s, 
      id_student: Number(s.id_student), 
      id_class: s.id_class ? Number(s.id_class) : null 
    }));
  }

  // --- 4. CREATE DATA MANUAL ---
  static async createStudent(data: { full_name: string; nis: string; id_class?: number | string }) {
    const newStudent = await prisma.tbl_students.create({
      data: {
        icode: this.generateIcode(),
        full_name: this.toTitleCase(data.full_name), 
        nis: data.nis,
        id_class: data.id_class ? Number(data.id_class) : null, 
        period_status: 'Suci', 
      }
    });
    return { ...newStudent, id_student: Number(newStudent.id_student), id_class: newStudent.id_class ? Number(newStudent.id_class) : null };
  }

  // --- 5. UPDATE DATA ---
  static async updateStudent(id: number, data: any) {
    const payload: any = {};
    if (data.full_name) payload.full_name = this.toTitleCase(data.full_name);
    if (data.nis) payload.nis = data.nis;
    if (data.id_class) payload.id_class = Number(data.id_class);
    if (data.period_status) payload.period_status = data.period_status;

    const updated = await prisma.tbl_students.update({
      where: { id_student: id },
      data: payload
    });
    return { ...updated, id_student: Number(updated.id_student), id_class: updated.id_class ? Number(updated.id_class) : null };
  }

  // --- 6. DELETE DATA ---
  static async deleteStudent(id: number) {
    await prisma.tbl_students.delete({ where: { id_student: id } });
    return true;
  }

  // --- 7. IMPORT BULK EXCEL ---
  static async importStudents(dataArray: any[]) {
    const classes = await prisma.tbl_classes.findMany({ 
      select: { id_class: true, class_name: true, grade_level: true } 
    });
    
    const classMap = new Map<string, number>();
    const validClassIds = new Set<number>();

    classes.forEach(cls => {
      const classIdNum = Number(cls.id_class);
      validClassIds.add(classIdNum);
      if (cls.class_name) {
        // 🔥 Daftarkan 2 format agar AI importnya cerdas
        const fullClassName = `${cls.grade_level} ${cls.class_name}`;
        classMap.set(this.toCanonicalKey(fullClassName), classIdNum); // Contoh: "10MIPA1"
        classMap.set(this.toCanonicalKey(cls.class_name), classIdNum); // Contoh: "MIPA1"
      }
    });

    const studentsToInsert = dataArray.map((item, index) => {
      const rowNum = index + 1;
      if (!item['Nama Lengkap'] || !item['NIS']) throw new Error(`Baris ke-${rowNum}: Nama Lengkap dan NIS wajib diisi.`);

      let finalClassId: number | null = null;
      const rawInput = item['Nama Kelas'] ? item['Nama Kelas'].toString() : "";

      if (/^\d+$/.test(rawInput)) {
        const parsedId = parseInt(rawInput);
        if (validClassIds.has(parsedId)) finalClassId = parsedId;
      } 
      if (!finalClassId && rawInput) finalClassId = classMap.get(this.toCanonicalKey(rawInput)) || null;
      if (!finalClassId) throw new Error(`Gagal pada Baris ${rowNum}: Kelas '${item['Nama Kelas']}' tidak ditemukan di sistem.`);

      return {
        icode: this.generateIcode(),
        full_name: this.toTitleCase(item['Nama Lengkap']),
        nis: item['NIS'].toString(),
        id_class: finalClassId, 
        period_status: 'Suci' 
      };
    });

    const result = await prisma.tbl_students.createMany({ data: studentsToInsert, skipDuplicates: true });
    return result.count;
  }
}