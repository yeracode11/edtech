'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, checkAuth, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      
      // Проверяем после загрузки
      const currentUser = useAuthStore.getState().user;
      const authenticated = useAuthStore.getState().isAuthenticated;
      
      if (!authenticated) {
        router.push('/auth/login');
      } else if (currentUser?.role !== 'ADMIN') {
        router.push('/');
      }
    };
    
    init();
  }, [checkAuth, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">⚡ JapJaryq Academy - Админка</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-primary hover:underline">
              На главную
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Добро пожаловать, {user?.firstName || user?.email}!
          </h2>
          <p className="text-muted-foreground">
            Управляйте курсами, пользователями и контентом платформы
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/courses">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <CardHeader>
                <CardTitle>📚 Курсы</CardTitle>
                <CardDescription>
                  Управление курсами и уроками
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Создание, редактирование и удаление курсов
                </p>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                  ✓ Доступно
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/lessons">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>🎥 Уроки</CardTitle>
                <CardDescription>
                  Управление уроками и видео
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Загрузка видео, создание тестов
                </p>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                 ✓ Доступно
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <CardHeader>
                <CardTitle>👥 Пользователи</CardTitle>
                <CardDescription>
                  Управление пользователями
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Просмотр и редактирование пользователей
                </p>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                  ✓ Доступно
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/payments">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <CardHeader>
                <CardTitle>💳 Платежи</CardTitle>
                <CardDescription>
                  Управление платежами
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Просмотр транзакций и подписок
                </p>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                  ✓ Доступно
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/access">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>🔑 Доступы</CardTitle>
                <CardDescription>
                  Управление доступами к курсам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Предоставление и отзыв доступов
                </p>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">
                  ⏳ В разработке
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/tests">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>✅ Тесты</CardTitle>
                <CardDescription>
                  Управление тестами и вопросами
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Создание тестов и вопросов
                </p>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">
                  ⏳ В разработке
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}

