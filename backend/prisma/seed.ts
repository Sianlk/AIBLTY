import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Get admin emails from environment
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
  
  // Create admin user if ADMIN_EMAILS is set
  if (adminEmails.length > 0) {
    for (const email of adminEmails) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      
      if (!existingUser) {
        const passwordHash = await bcrypt.hash('changeme123', 12);
        
        await prisma.user.create({
          data: {
            email,
            passwordHash,
            role: 'admin',
            plan: 'elite',
            name: 'Admin',
          },
        });
        
        console.log(`✅ Created admin user: ${email}`);
        console.log('   Default password: changeme123 (CHANGE THIS IMMEDIATELY)');
      } else {
        // Update existing user to admin
        await prisma.user.update({
          where: { email },
          data: { role: 'admin', plan: 'elite' },
        });
        console.log(`✅ Updated existing user to admin: ${email}`);
      }
    }
  } else {
    console.log('⚠️  No ADMIN_EMAILS set. Skipping admin user creation.');
  }

  // Create default settings
  const defaultSettings = [
    { key: 'platform_name', value: { name: 'AIBLTY' } },
    { key: 'platform_version', value: { version: '1.0.0' } },
    { key: 'free_plan_limits', value: { projects: 3, sessions_per_day: 10, messages_per_session: 50 } },
    { key: 'pro_plan_limits', value: { projects: 20, sessions_per_day: 100, messages_per_session: 500 } },
    { key: 'elite_plan_limits', value: { projects: -1, sessions_per_day: -1, messages_per_session: -1 } },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  
  console.log('✅ Default settings created');
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
