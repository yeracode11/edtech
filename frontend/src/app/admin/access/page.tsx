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

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface Enrollment {
  userId: string;
  courseId: string;
  enrolledAt: string;
  expiresAt?: string;
  user: User;
  course: {
    id: string;
    title: string;
    price: number;
  };
}

export default function AdminAccessPage() {
  const router = useRouter();
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Форма
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [filterCourse, setFilterCourse] = useState('');

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, router]);

  const fetchData = async () => {
    try {
      const [enrollmentsRes, usersRes, coursesRes] = await Promise.all([
        api.get('/enrollments'),
        api.get('/users'),
        api.get('/courses'),
      ]);

      setEnrollments(enrollmentsRes.data.enrollments || []);
      setUsers(usersRes.data.users || []);
      setCourses(coursesRes.data.courses || []);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId || !selectedCourseId) {
      alert('Выберите пользователя и курс');
      return;
    }

    try {
      await api.post('/enrollments', {
        userId: selectedUserId,
        courseId: selectedCourseId,
        expiresAt: expiresAt || undefined,
      });

      alert('Доступ предоставлен');
      resetForm();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка предоставления доступа');
    }
  };

  const handleRevoke = async (userId: string, courseId: string) => {
    if (!confirm('Отозвать доступ?')) return;
    
    try {
      await api.delete(`/enrollments/${userId}/${courseId}`);
      alert('Доступ отозван');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка отзыва доступа');
    }
  };

  const handleExtend = async (userId: string, courseId: string) => {
    const days = prompt('Продлить на сколько дней?', '30');
    if (!days) return;

    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + parseInt(days));

    try {
      await api.put(`/enrollments/${userId}/${courseId}`, {
        expiresAt: newExpiry.toISOString(),
      });

      alert('Доступ продлен');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка продления');
    }
  };

  const resetForm = () => {
    setSelectedUserId('');
    setSelectedCourseId('');
    setExpiresAt('');
    setShowForm(false);
  };

  const filteredEnrollments = filterCourse
    ? enrollments.filter((e) => e.courseId === filterCourse)
    : enrollments;

  const getUserName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email;
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const isExpiringSoon = (expiresAt?: string) => {
    if (!expiresAt) return false;
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days > 0 && days <= 7;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">🔑 Управление доступами</h1>
          <Link href="/admin" className="text-sm text-primary hover:underline">
            ← Назад в админку
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-medium mr-2">Фильтр по курсу:</label>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
              >
                <option value="">Все курсы</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-muted-foreground">
              Всего доступов: {filteredEnrollments.length}
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Отменить' : '+ Предоставить доступ'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Предоставить доступ к курсу</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Пользователь</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    required
                  >
                    <option value="">Выберите пользователя</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {getUserName(user)} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Курс</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    required
                  >
                    <option value="">Выберите курс</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Срок действия (опционально)</label>
                  <Input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    placeholder="Оставьте пустым для бессрочного доступа"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Если не указать дату, доступ будет бессрочным
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Предоставить доступ</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {filteredEnrollments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Доступов пока нет
              </CardContent>
            </Card>
          ) : (
            filteredEnrollments.map((enrollment) => (
              <Card key={`${enrollment.userId}-${enrollment.courseId}`}>
                <CardContent className="py-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{getUserName(enrollment.user)}</h3>
                        {enrollment.expiresAt ? (
                          isExpired(enrollment.expiresAt) ? (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                              Истек
                            </span>
                          ) : isExpiringSoon(enrollment.expiresAt) ? (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
                              Истекает скоро
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                              Активен
                            </span>
                          )
                        ) : (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                            Бессрочный
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Курс: {enrollment.course.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>
                          Записан: {new Date(enrollment.enrolledAt).toLocaleDateString('ru-RU')}
                        </span>
                        {enrollment.expiresAt && (
                          <span>
                            Истекает: {new Date(enrollment.expiresAt).toLocaleDateString('ru-RU')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {enrollment.expiresAt && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExtend(enrollment.userId, enrollment.courseId)}
                        >
                          Продлить
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRevoke(enrollment.userId, enrollment.courseId)}
                      >
                        Отозвать
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

