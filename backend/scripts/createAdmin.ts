import prisma from '../src/config/database';
import { hashPassword } from '../src/utils/password';

async function createAdmin() {
  try {
    const email = 'admin@japjaryq.kz';
    const password = 'admin123'; // Измените на нужный пароль
    
    console.log('🔧 Создание администратора...\n');

    // Проверяем, существует ли уже такой пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`⚠️  Пользователь ${email} уже существует`);
      
      // Обновляем роль на ADMIN, если нужно
      if (existingUser.role !== 'ADMIN') {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: 'ADMIN' },
        });
        console.log('✅ Роль обновлена на ADMIN');
      } else {
        console.log('✅ Пользователь уже является администратором');
      }
      
      // Обновляем пароль
      const passwordHash = await hashPassword(password);
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { passwordHash },
      });
      console.log('✅ Пароль обновлен');
      
      return;
    }

    // Создаем нового админа
    const passwordHash = await hashPassword(password);
    
    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: 'Admin',
        lastName: 'JapJaryq',
        role: 'ADMIN',
      },
    });

    console.log('✅ Администратор успешно создан!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   ID: ${admin.id}`);
    console.log(`   Роль: ${admin.role}`);
    console.log(`   Пароль: ${password}`);
    console.log('\n⚠️  ВАЖНО: Сохраните пароль в безопасном месте!');
  } catch (error: any) {
    console.error('❌ Ошибка при создании администратора:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

