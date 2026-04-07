import { PrismaClient } from '@prisma/client'

export async function ClassSeeder(prisma: PrismaClient) {
  console.log('   ⏳ Processing : tbl_classes...')
  
  const existingClasses = await prisma.tbl_classes.count()
  if (existingClasses === 0) {
    await prisma.tbl_classes.createMany({
      data: [
        { class_name: 'X MIPA 1', advisor: 'Drs. Suwarno', description: 'Kelas Reguler' },
        { class_name: 'XI IPS 2', advisor: 'Siti Aminah, S.Pd', description: 'Kelas Sosial' },
        { class_name: 'XII IPA 1', advisor: 'Budi Santoso, M.Pd', description: 'Kelas Unggulan' },
      ]
    })
    console.log('   ✅ Done       : 3 Default classes successfully created!\n')
  } else {
    console.log('   ⏩ Skipped    : Class data already exists.\n')
  }
}