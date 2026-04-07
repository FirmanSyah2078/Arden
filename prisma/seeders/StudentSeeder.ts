import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

export async function StudentSeeder(prisma: PrismaClient) {
  console.log('   ⏳ Processing : tbl_students...')
  
  const existingStudents = await prisma.tbl_students.count()
  
  if (existingStudents === 0) {
    const classes = await prisma.tbl_classes.findMany()
    
    if (classes.length > 0) {
      await prisma.tbl_students.createMany({
        data: [
          {
            nis: '10012026',
            full_name: 'Aisyah Putri',
            id_class: classes[0].id_class, 
            period_status: 'Suci',
            icode: `ARD-${randomUUID().split('-')[0].toUpperCase()}`,
            notes: 'Siswi aktif'
          },
          {
            nis: '10022026',
            full_name: 'Bunga Lestari',
            id_class: classes[1] ? classes[1].id_class : classes[0].id_class, 
            period_status: 'Suci',
            icode: `ARD-${randomUUID().split('-')[0].toUpperCase()}`,
            notes: 'Ketua ekskul'
          }
        ]
      })
      console.log('   ✅ Done       : 2 Dummy students successfully created!\n')
    } else {
      console.log('   ❌ Failed     : No classes found, cannot create students.\n')
    }
  } else {
    console.log('   ⏩ Skipped    : Student data already exists.\n')
  }
}