import prisma from '../src/config/database';

async function checkUsers() {
  try {
    console.log('🔍 Проверка пользователей в базе данных...\n');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        refreshTokens: {
          select: {
            id: true,
            expiresAt: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (users.length === 0) {
      console.log('❌ Пользователи не найдены в базе данных');
      return;
    }

    console.log(`✅ Найдено пользователей: ${users.length}\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Имя: ${user.firstName || 'не указано'} ${user.lastName || ''}`);
      console.log(`   Роль: ${user.role}`);
      console.log(`   Создан: ${user.createdAt.toLocaleString('ru-RU')}`);
      console.log(`   Refresh токенов: ${user.refreshTokens.length}`);
      
      if (user.refreshTokens.length > 0) {
        const validTokens = user.refreshTokens.filter(
          (token) => token.expiresAt > new Date()
        );
        console.log(`   Валидных токенов: ${validTokens.length}`);
        
        if (validTokens.length > 0) {
          console.log(`   Последний токен истекает: ${validTokens[0].expiresAt.toLocaleString('ru-RU')}`);
        }
      }
      console.log('');
    });

    // Проверяем конкретного админа
    const admin = users.find((u) => u.email === 'admin@japjaryq.kz');
    if (admin) {
      console.log('✅ Админ admin@japjaryq.kz найден!');
      if (admin.role !== 'ADMIN') {
        console.log('⚠️  ВНИМАНИЕ: У пользователя роль USER, а не ADMIN!');
      }
    } else {
      console.log('❌ Админ admin@japjaryq.kz НЕ найден в базе данных');
    }
  } catch (error: any) {
    console.error('❌ Ошибка при проверке пользователей:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();

