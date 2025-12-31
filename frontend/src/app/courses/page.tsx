'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCourses } from '@/hooks/useCourses';
import { formatPrice } from '@/lib/utils';

export default function CoursesPage() {
  const { courses, loading, error } = useCourses();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">Загрузка курсов...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-destructive">Ошибка: {error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Доступные курсы</h1>
          
          {courses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Курсы пока не добавлены
            </div>
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
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(course.price)}
                    </div>
                    {course.lessons && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {course.lessons.length} уроков
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Link href={`/courses/${course.id}`} className="w-full">
                      <Button className="w-full">Подробнее</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}



