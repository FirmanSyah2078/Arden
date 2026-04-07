// 🔥 FIX: Hapus `import { PrismaClient } from '@prisma/client'`
// 🔥 FIX: Hapus `const prisma = new PrismaClient()`
// Ganti dengan mengambil instance Prisma yang sudah di-setting adapter PG-nya:
import { prisma } from '../src/lib/prisma' // 🔥 FIX: Mengambil instance Prisma yang sudah di-setting adapter PG-nya

import { UserSeeder } from './seeders/UserSeeder'
import { ClassSeeder } from './seeders/ClassSeeder'
import { StudentSeeder } from './seeders/StudentSeeder'

async function main() {
  console.log('\n==================================================')
  console.log(' 🚀 INITIATING ARDEN MASTER SEEDER...')
  console.log('==================================================\n')

  try {
    // 1. User
    console.log('▶ [1/3] Preparing Users data...')
    await UserSeeder(prisma)
    
    // 2. Class
    console.log('▶ [2/3] Preparing Classes data...')
    await ClassSeeder(prisma)
    
    // 3. Student
    console.log('▶ [3/3] Preparing Students data...')
    await StudentSeeder(prisma)

    console.log('==================================================')
    console.log(' ✨ [SUCCESS] ALL INITIAL DATA SUCCESSFULLY INJECTED!')
    console.log('==================================================\n')
    
    console.log(' Here is your default profile:')
    console.log(' 👤 Username : admin')
    console.log(' 🔑 Password : admin123')
    console.log('\n Welcome to ARDEN! You are now ready to go. 🚀\n')

  } catch (error) {
    console.error('\n==================================================')
    console.error(' ❌ [FAILED] AN ERROR OCCURRED DURING SEEDING:')
    console.error('==================================================')
    console.error(error)
    process.exit(1)
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })