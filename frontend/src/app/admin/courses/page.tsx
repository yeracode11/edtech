'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { Course } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function AdminCoursesPage() {
  const router = useRouter();
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  // Форма
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceInstallment, setPriceInstallment] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchCourses();
  }, [isAuthenticated, user, router]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Ошибка загрузки курсов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        title,
        description,
        price: parseFloat(price),
        priceInstallment: priceInstallment ? parseFloat(priceInstallment) : undefined,
        thumbnail,
        isPublished,
      };

      if (editingCourse) {
        await api.put(`/courses/${editingCourse.id}`, data);
      } else {
        await api.post('/courses', data);
      }

      resetForm();
      fetchCourses();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка сохранения');
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description || '');
    setPrice(course.price.toString());
    setPriceInstallment(course.priceInstallment?.toString() || '');
    setThumbnail(course.thumbnail || '');
    setIsPublished(course.isPublished);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить курс?')) return;
    
    try {
      await api.delete(`/courses/${id}`);
      fetchCourses();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка удаления');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setPriceInstallment('');
    setThumbnail('');
    setIsPublished(false);
    setEditingCourse(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">📚 Управление курсами</h1>
          <Link href="/admin" className="text-sm text-primary hover:underline">
            ← Назад в админку
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Отменить' : '+ Добавить курс'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingCourse ? 'Редактировать курс' : 'Новый курс'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Название</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Основы электрики"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Описание</label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Подробное описание курса..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Цена наличными (₸)</label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      placeholder="25000"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Цена в рассрочку (₸)</label>
                    <Input
                      type="number"
                      value={priceInstallment}
                      onChange={(e) => setPriceInstallment(e.target.value)}
                      placeholder="30000"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">URL изображения</label>
                  <Input
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="published" className="text-sm font-medium cursor-pointer">
                    Опубликовать курс
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    {editingCourse ? 'Сохранить' : 'Создать'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {courses.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Курсов пока нет. Создайте первый курс!
              </CardContent>
            </Card>
          ) : (
            courses.map((course) => (
              <Card key={course.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{course.title}</h3>
                        {course.isPublished ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                            Опубликован
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                            Черновик
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {course.description || 'Без описания'}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-semibold text-primary">
                          {formatPrice(course.price)}
                        </span>
                        {course.lessons && (
                          <span className="text-muted-foreground">
                            {course.lessons.length} уроков
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(course)}>
                        Изменить
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(course.id)}>
                        Удалить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}



