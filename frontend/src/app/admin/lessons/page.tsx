'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { Course, Lesson } from '@/types';
import { formatDuration } from '@/lib/utils';

export default function AdminLessonsPage() {
  const router = useRouter();
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  
  // Форма
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'VIDEO' | 'TEXT' | 'QUIZ'>('VIDEO');
  const [order, setOrder] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  
  // Загрузка файла
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

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

  const fetchLessons = async (courseId: string) => {
    try {
      const response = await api.get(`/lessons/course/${courseId}`);
      setLessons(response.data.lessons || []);
    } catch (error) {
      console.error('Ошибка загрузки уроков:', error);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    fetchLessons(course.id);
    setShowForm(false);
    resetForm();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const uploadVideoFile = async () => {
    if (!videoFile) return null;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', videoFile);

      const response = await api.post('/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setUploadProgress(percentCompleted);
        },
      });

      setIsUploading(false);
      return response.data.videoUrl;
    } catch (error) {
      console.error('Ошибка загрузки видео:', error);
      setIsUploading(false);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      alert('Выберите курс');
      return;
    }

    try {
      let finalVideoUrl = videoUrl;

      // Если выбран файл для загрузки, загружаем его
      if (type === 'VIDEO' && videoFile) {
        const uploadedUrl = await uploadVideoFile();
        if (uploadedUrl) {
          finalVideoUrl = uploadedUrl;
        }
      }

      const data = {
        title,
        description,
        courseId: selectedCourse.id,
        type,
        order: parseInt(order) || lessons.length,
        content: type === 'TEXT' ? content : undefined,
        videoUrl: type === 'VIDEO' ? finalVideoUrl : undefined,
        duration: duration ? parseInt(duration) : undefined,
        isPublished,
      };

      if (editingLesson) {
        await api.put(`/lessons/${editingLesson.id}`, data);
      } else {
        await api.post('/lessons', data);
      }

      resetForm();
      setShowForm(false);
      fetchLessons(selectedCourse.id);
      alert(editingLesson ? 'Урок обновлён' : 'Урок создан');
    } catch (error: any) {
      console.error('Ошибка сохранения урока:', error);
      alert(error.response?.data?.error || 'Ошибка сохранения урока');
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setTitle(lesson.title);
    setDescription(lesson.description || '');
    setType(lesson.type);
    setOrder(lesson.order.toString());
    setContent(lesson.content || '');
    setVideoUrl(lesson.videoUrl || '');
    setDuration(lesson.duration?.toString() || '');
    setIsPublished(lesson.isPublished);
    setVideoFile(null);
    setUploadProgress(0);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить урок?')) return;
    
    try {
      await api.delete(`/lessons/${id}`);
      if (selectedCourse) {
        fetchLessons(selectedCourse.id);
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка удаления');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('VIDEO');
    setOrder('');
    setContent('');
    setVideoUrl('');
    setDuration('');
    setIsPublished(false);
    setEditingLesson(null);
    setShowForm(false);
    setVideoFile(null);
    setUploadProgress(0);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return '🎥 Видео';
      case 'TEXT':
        return '📄 Текст';
      case 'QUIZ':
        return '✅ Тест';
      default:
        return type;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">🎥 Управление уроками</h1>
          <Link href="/admin" className="text-sm text-primary hover:underline">
            ← Назад в админку
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Список курсов */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Выберите курс</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                {courses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Курсов пока нет</p>
                ) : (
                  courses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => handleCourseSelect(course)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedCourse?.id === course.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      <p className="font-medium text-sm">{course.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {course.lessons?.length || 0} уроков
                      </p>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Уроки выбранного курса */}
          <div className="lg:col-span-2">
            {!selectedCourse ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Выберите курс для управления уроками
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{selectedCourse.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      Всего уроков: {lessons.length}
                    </p>
                  </div>
                  <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Отменить' : '+ Добавить урок'}
                  </Button>
                </div>

                {showForm && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>{editingLesson ? 'Редактировать урок' : 'Новый урок'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Название</label>
                          <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Введение в электрику"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Описание</label>
                          <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Описание урока..."
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium">Тип урока</label>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={type}
                              onChange={(e) => setType(e.target.value as any)}
                            >
                              <option value="VIDEO">Видео</option>
                              <option value="TEXT">Текст</option>
                              <option value="QUIZ">Тест</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Порядок</label>
                            <Input
                              type="number"
                              value={order}
                              onChange={(e) => setOrder(e.target.value)}
                              placeholder={(lessons.length).toString()}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Длительность (мин)</label>
                            <Input
                              type="number"
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              placeholder="30"
                            />
                          </div>
                        </div>
                        {type === 'VIDEO' && (
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">URL видео</label>
                              <Input
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="https://youtube.com/watch?v=... или прямая ссылка"
                                disabled={!!videoFile}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Поддерживаются: YouTube, Vimeo, прямые ссылки на .mp4
                              </p>
                            </div>
                            
                            <div className="relative">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <div className="flex-1 h-px bg-border"></div>
                                <span>или</span>
                                <div className="flex-1 h-px bg-border"></div>
                              </div>
                              
                              <label className="text-sm font-medium">Загрузить видео файл</label>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleFileChange}
                                disabled={!!videoUrl || isUploading}
                                className="block w-full text-sm text-muted-foreground mt-1
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-md file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-primary file:text-primary-foreground
                                  hover:file:bg-primary/90
                                  file:cursor-pointer cursor-pointer
                                  disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              {videoFile && (
                                <div className="mt-2 p-3 bg-accent rounded-md">
                                  <p className="text-sm font-medium">📹 {videoFile.name}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Размер: {(videoFile.size / 1024 / 1024).toFixed(2)} МБ
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => setVideoFile(null)}
                                    className="text-xs text-destructive hover:underline mt-1"
                                  >
                                    Удалить
                                  </button>
                                </div>
                              )}
                              {isUploading && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span>Загрузка...</span>
                                    <span>{uploadProgress}%</span>
                                  </div>
                                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                    <div
                                      className="bg-primary h-full transition-all duration-300"
                                      style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                              <p className="text-xs text-muted-foreground mt-2">
                                Максимальный размер: 500 МБ. Поддерживаются: MP4, AVI, MOV, MKV, WebM
                              </p>
                            </div>
                          </div>
                        )}
                        {type === 'TEXT' && (
                          <div>
                            <label className="text-sm font-medium">Содержимое урока</label>
                            <textarea
                              className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              placeholder="Текстовое содержание урока... Можно использовать Markdown"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Поддерживается Markdown форматирование
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="published"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="w-4 h-4"
                          />
                          <label htmlFor="published" className="text-sm font-medium cursor-pointer">
                            Опубликовать урок
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit">
                            {editingLesson ? 'Сохранить' : 'Создать'}
                          </Button>
                          <Button type="button" variant="outline" onClick={resetForm}>
                            Отмена
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-3">
                  {lessons.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        Уроков пока нет. Создайте первый урок!
                      </CardContent>
                    </Card>
                  ) : (
                    lessons.map((lesson) => (
                      <Card key={lesson.id}>
                        <CardContent className="py-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-muted-foreground">#{lesson.order}</span>
                                <h3 className="font-semibold">{lesson.title}</h3>
                                {lesson.isPublished ? (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                    Опубликован
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
                                    Черновик
                                  </span>
                                )}
                              </div>
                              {lesson.description && (
                                <p className="text-sm text-muted-foreground mb-1">
                                  {lesson.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{getTypeLabel(lesson.type)}</span>
                                {lesson.duration && (
                                  <span>{formatDuration(lesson.duration)}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEdit(lesson)}>
                                Изменить
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(lesson.id)}>
                                Удалить
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
