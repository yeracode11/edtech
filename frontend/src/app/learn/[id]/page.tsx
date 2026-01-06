'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { formatDuration, formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Course, Lesson } from '@/types';

interface LessonProgressSummary {
  id: string;
  title: string;
  order: number;
  completed: boolean;
}

interface CourseProgressResponse {
  course: Course & { lessons: Lesson[] };
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lessons: LessonProgressSummary[];
}

export default function LearnCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  const courseId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<Course & { lessons: Lesson[] } | null>(null);
  const [progress, setProgress] = useState<CourseProgressResponse | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Защита от копирования контента (только для области урока)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Блокируем копирование только в области контента урока
      const isInLessonContent = target.closest('[data-protected-content]');
      if (isInLessonContent) {
        // Блокируем Ctrl+C, Ctrl+A, Ctrl+X, Ctrl+S, Ctrl+P
        if (
          (e.ctrlKey || e.metaKey) &&
          (e.key === 'c' || e.key === 'a' || e.key === 'x' || e.key === 's' || e.key === 'p')
        ) {
          e.preventDefault();
          return false;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isEmbedUrl = (url: string) =>
    /youtube\.com|youtu\.be|vimeo\.com/.test(url);

  // Нормализация URL видео - если это относительный путь, добавляем базовый URL бэкенда
  const normalizeVideoUrl = (url: string | null | undefined): string => {
    if (!url) return '';
    
    // Если это уже полный URL (http/https), возвращаем как есть
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Если это относительный путь к загруженному файлу, добавляем базовый URL бэкенда
    if (url.startsWith('/uploads/')) {
      // Получаем базовый URL бэкенда из переменной окружения
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      // Убираем /api из конца URL, если есть
      const baseUrl = apiUrl.endsWith('/api') 
        ? apiUrl.slice(0, -4) 
        : apiUrl.replace('/api', '');
      return `${baseUrl}${url}`;
    }
    
    return url;
  };

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      const u = new URL(url);
      let videoId = '';
      
      if (u.hostname.includes('youtu.be')) {
        videoId = u.pathname.slice(1);
      } else if (u.searchParams.get('v')) {
        videoId = u.searchParams.get('v') || '';
      }
      
      if (videoId) {
        // Параметры для максимального скрытия элементов YouTube
        const params = new URLSearchParams({
          'modestbranding': '1',      // Скрыть логотип YouTube
          'rel': '0',                 // Не показывать похожие видео
          'disablekb': '1',           // Отключить клавиатуру
          'fs': '0',                  // Отключить полноэкранный режим
          'iv_load_policy': '3',      // Скрыть аннотации
          'playsinline': '1',         // Встроенное воспроизведение
          'controls': '1',            // Показывать базовые элементы управления
          'cc_load_policy': '0',      // Скрыть субтитры по умолчанию
          'showinfo': '0',            // Скрыть информацию о видео
          'loop': '0',                // Не зацикливать
          'mute': '0',                // Не отключать звук
          'origin': typeof window !== 'undefined' ? window.location.origin : '',
        });
        
        // Используем youtube-nocookie.com для скрытия брендинга YouTube
        return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
      }
    } catch {
      // ignore parsing errors
    }
    return url;
  };

  // Защита по авторизации
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Загрузка курса и прогресса
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get<CourseProgressResponse>(`/progress/course/${courseId}`);
        setProgress(res.data);
        setCourse(res.data.course);

        const lessonsSorted = [...(res.data.course.lessons || [])].sort(
          (a, b) => a.order - b.order
        );

        // Выбираем первый незавершенный урок или первый
        const firstIncompleteId =
          res.data.lessons.find((l) => !l.completed)?.id || lessonsSorted[0]?.id;
        const initialLesson =
          lessonsSorted.find((l) => l.id === firstIncompleteId) || lessonsSorted[0] || null;

        setSelectedLesson(initialLesson || null);
      } catch (err: any) {
        const message = err?.response?.data?.error || err.message || 'Ошибка загрузки курса';
        setError(message);

        // Если нет доступа к курсу — отправляем на страницу курса
        if (message.includes('не записан') || message.includes('Нет доступа')) {
          router.push(`/courses/${courseId}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && courseId) {
      load();
    }
  }, [courseId, isAuthenticated, router]);

  const handleMarkComplete = async (lessonId: string) => {
    try {
      await api.post(`/progress/lesson/${lessonId}/complete`);

      setProgress((prev) =>
        prev
          ? {
              ...prev,
              lessons: prev.lessons.map((l) =>
                l.id === lessonId ? { ...l, completed: true } : l
              ),
              completedLessons: prev.completedLessons + (prev.lessons.find((l) => l.id === lessonId)?.completed ? 0 : 1),
              progressPercentage:
                prev.totalLessons > 0
                  ? Math.round(
                      ((prev.completedLessons + 1) / prev.totalLessons) * 100
                    )
                  : prev.progressPercentage,
            }
          : prev
      );
    } catch {
      // TODO: можно добавить показ тоста
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <div>Загрузка курса...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Курс недоступен</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link href="/courses">
              <Button>Вернуться к курсам</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const lessonsSorted = [...(course.lessons || [])].sort((a, b) => a.order - b.order);
  const currentLesson: Lesson | null =
    selectedLesson ?? (lessonsSorted.length > 0 ? lessonsSorted[0] : null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-primary mb-6 inline-block"
          >
            ← В личный кабинет
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">{course.title}</h1>
              {course.description && (
                <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
                  {course.description}
                </p>
              )}
            </div>
            {progress && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">
                  Прогресс по курсу
                </div>
                <div className="text-lg font-semibold">
                  {progress.progressPercentage}% ({progress.completedLessons}/
                  {progress.totalLessons})
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-8">
            {/* Область просмотра урока */}
            <div className="md:col-span-2">
              {currentLesson ? (
                <div data-protected-content>
                  <h2 className="text-2xl font-bold mb-4">
                    Урок {currentLesson.order}. {currentLesson.title}
                  </h2>

                  {currentLesson.type === 'VIDEO' && currentLesson.videoUrl && (
                    <div 
                      className="mb-4 rounded-xl overflow-hidden bg-black aspect-video relative select-none"
                      onContextMenu={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                      data-protected-content
                    >
                      {isEmbedUrl(currentLesson.videoUrl) ? (
                        <div className="relative w-full h-full">
                          <iframe
                            src={
                              currentLesson.videoUrl.includes('youtu')
                                ? getYoutubeEmbedUrl(currentLesson.videoUrl)
                                : currentLesson.videoUrl
                            }
                            className="w-full h-full pointer-events-auto"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen={false}
                            loading="lazy"
                            style={{ pointerEvents: 'auto' }}
                            frameBorder="0"
                          />
                          {/* Overlay для скрытия элементов YouTube - верхняя часть */}
                          <div 
                            className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-20"
                            style={{
                              background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)',
                            }}
                          />
                          {/* Скрываем логотип YouTube в правом нижнем углу */}
                          <div 
                            className="absolute bottom-0 right-0 w-32 h-16 pointer-events-none z-20"
                            style={{
                              background: 'linear-gradient(to top right, rgba(0,0,0,0.6) 0%, transparent 60%)',
                            }}
                          />
                          {/* Скрываем левый нижний угол (где могут быть элементы управления) */}
                          <div 
                            className="absolute bottom-0 left-0 w-40 h-12 pointer-events-none z-20"
                            style={{
                              background: 'linear-gradient(to top left, rgba(0,0,0,0.3) 0%, transparent 50%)',
                            }}
                          />
                        </div>
                      ) : (
                        <video
                          src={normalizeVideoUrl(currentLesson.videoUrl)}
                          controls
                          className="w-full h-full"
                          controlsList="nodownload noplaybackrate"
                          disablePictureInPicture
                          onContextMenu={(e) => e.preventDefault()}
                          onEnded={() => handleMarkComplete(currentLesson.id)}
                          onError={(e) => {
                            console.error('Ошибка загрузки видео:', {
                              videoUrl: currentLesson.videoUrl,
                              normalizedUrl: normalizeVideoUrl(currentLesson.videoUrl),
                              error: e
                            });
                          }}
                        />
                      )}
                      {/* Overlay для защиты от копирования */}
                      <div 
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{ userSelect: 'none' }}
                      />
                    </div>
                  )}

                  {currentLesson.type === 'TEXT' && currentLesson.content && (
                    <div 
                      className="bg-card border rounded-xl p-4 sm:p-6 mb-4 protect-content"
                      onContextMenu={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onMouseDown={(e) => {
                        // Блокируем выделение текста
                        if (e.detail > 1) {
                          e.preventDefault();
                        }
                      }}
                      data-protected-content
                    >
                      <p className="whitespace-pre-line text-sm sm:text-base text-muted-foreground">
                        {currentLesson.content}
                      </p>
                    </div>
                  )}

                  {currentLesson.type === 'QUIZ' && (
                    <div className="bg-card border rounded-xl p-4 sm:p-6 mb-4 text-sm text-muted-foreground">
                      Тест по этому уроку будет доступен в следующей версии платформы.
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      {currentLesson.duration && (
                        <>⏱️ {formatDuration(currentLesson.duration)}</>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkComplete(currentLesson.id)}
                    >
                      Отметить как пройденный
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  В этом курсе пока нет опубликованных уроков.
                </div>
              )}
            </div>

            {/* Список уроков и краткая инфа */}
            <div className="md:col-span-1">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Курс</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-lg font-semibold">{course.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Стоимость: {formatPrice(course.price)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Уроков: {lessonsSorted.length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Список уроков</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {lessonsSorted.map((lesson) => {
                    const summary = progress?.lessons.find((l) => l.id === lesson.id);
                    const isActive = currentLesson?.id === lesson.id;
                    const isCompleted = summary?.completed;

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => setSelectedLesson(lesson)}
                        className={`w-full text-left px-3 py-2 rounded-md border text-sm transition-colors ${
                          isActive
                            ? 'border-primary bg-orange-50'
                            : 'border-border hover:bg-muted/60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-medium truncate">
                              {lesson.order}. {lesson.title}
                            </div>
                            {lesson.duration && (
                              <div className="text-xs text-muted-foreground">
                                ⏱️ {formatDuration(lesson.duration)}
                              </div>
                            )}
                          </div>
                          {isCompleted && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                              Пройдено
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


