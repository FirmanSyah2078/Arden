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

  // --- 4. CREATE DATA MANUAL (Dengan Validasi Duplikat) ---
  static async createStudent(data: { full_name: string; nis: string; id_class?: number | string }) {
    
    // 🔥 CEK DUPLIKASI NIS SEBELUM MENYIMPAN
    const existingStudent = await prisma.tbl_students.findFirst({
      where: { nis: data.nis }
    });

    if (existingStudent) {
      // Jika NIS sudah ada, lemparkan error dengan kalimat yang jelas!
      throw new Error(`Registration failed: NIS '${data.nis}' is already registered to ${existingStudent.full_name}.`);
    }

    const newStudent = await prisma.tbl_students.create({
      data: {
        icode: this.generateIcode(),
        full_name: this.toTitleCase(data.full_name), 
        nis: data.nis,
        id_class: data.id_class ? Number(data.id_class) : null, 
        period_status: 'Suci', 
      }
    });
    
    return { 
      ...newStudent, 
      id_student: Number(newStudent.id_student), 
      id_class: newStudent.id_class ? Number(newStudent.id_class) : null 
    };
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

  // --- 7. IMPORT BULK EXCEL & SQL (WITH DUPLICATE LOGGING) ---
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
      const fullClassName = `${cls.grade_level} ${cls.class_name}`;
      classMap.set(this.toCanonicalKey(fullClassName), classIdNum);
      classMap.set(this.toCanonicalKey(cls.class_name), classIdNum);
    }
  });

  // 🔥 AMBIL SEMUA NIS YANG SUDAH ADA DI DB
  const existingStudents = await prisma.tbl_students.findMany({ select: { nis: true } });
  const existingNisSet = new Set(existingStudents.map(s => s.nis));

  const studentsToInsert: any[] = [];
  const duplicateLogs: string[] = []; // Menampung info data ganda

  dataArray.forEach((item, index) => {
    const rowNum = index + 1;
    const inputNis = item['NIS']?.toString();
    const inputName = item['Nama Lengkap'];

    // Cek Duplikasi NIS
    if (existingNisSet.has(inputNis)) {
      duplicateLogs.push(`${inputName} (NIS: ${inputNis})`);
      return; // Skip baris ini, lanjut ke baris berikutnya
    }

    let finalClassId: number | null = null;
    const rawInput = item['Nama Kelas'] ? item['Nama Kelas'].toString() : "";

    if (/^\d+$/.test(rawInput)) {
      const parsedId = parseInt(rawInput);
      if (validClassIds.has(parsedId)) finalClassId = parsedId;
    } 
    if (!finalClassId && rawInput) finalClassId = classMap.get(this.toCanonicalKey(rawInput)) || null;
    
    if (!finalClassId) throw new Error(`Row ${rowNum}: Class '${item['Nama Kelas']}' not found.`);

    studentsToInsert.push({
      icode: this.generateIcode(),
      full_name: this.toTitleCase(inputName),
      nis: inputNis,
      id_class: finalClassId, 
      period_status: 'Suci' 
    });
  });

  if (studentsToInsert.length > 0) {
    await prisma.tbl_students.createMany({ data: studentsToInsert });
  }

  return {
    count: studentsToInsert.length,
    duplicates: duplicateLogs // 🔥 Kirim daftar duplikat ke UI
  };
}
}