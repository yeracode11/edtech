'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { useUserCourses } from '@/hooks/useCourses';
import { formatPrice } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const { courses, loading: coursesLoading } = useUserCourses();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || coursesLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">Загрузка...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Привет, {user?.firstName || user?.email}!
            </h1>
            <p className="text-muted-foreground">
              Добро пожаловать в ваш личный кабинет
            </p>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Мои курсы</h2>
            
            {courses.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    У вас пока нет приобретенных курсов
                  </p>
                  <Link href="/courses">
                    <Button>Выбрать курс</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="flex flex-col">
                    {course.thumbnail && (
                      <div className="w-full h-48 bg-muted rounded-t-lg overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>
                        {course.description || 'Описание отсутствует'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      {course.lessons && (
                        <p className="text-sm text-muted-foreground">
                          {course.lessons.length} уроков
                        </p>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Link href={`/learn/${course.id}`} className="w-full">
                        <Button className="w-full">Продолжить обучение</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

