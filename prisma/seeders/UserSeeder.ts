import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

export async function UserSeeder(prisma: PrismaClient) {
  console.log('   ⏳ Processing : tbl_users...')
  
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  await prisma.tbl_users.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Administrator',
      username: 'admin',
      password: hashedPassword,
      role: 'Admin',
      is_active: true,
    },
  })
  
  console.log('   ✅ Done       : Administrator account successfully created!\n')
}