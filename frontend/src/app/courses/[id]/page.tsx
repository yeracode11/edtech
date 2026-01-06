'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCourse } from '@/hooks/useCourses';
import api from '@/lib/api';
import { formatPrice, formatDuration } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import type { Lesson } from '@/types';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const courseId = params?.id as string;
  const { course, loading, error } = useCourse(courseId);
  const { isAuthenticated, user } = useAuthStore();

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <div>{t.courseDetail.loading}</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t.courseDetail.notFound}</h1>
            <p className="text-muted-foreground mb-6">{error || t.courseDetail.notExists}</p>
            <Link href="/courses">
              <Button>{t.courseDetail.returnToCourses}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const sortedLessons: Lesson[] = course.lessons
    ? [...course.lessons].sort((a, b) => a.order - b.order)
    : [];

  const currentLesson: Lesson | null =
    selectedLesson ?? (sortedLessons.length > 0 ? sortedLessons[0] : null);

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

  const handleEnrollClick = async () => {
    if (!isAuthenticated) {
      router.push('/auth/register');
      return;
    }

    try {
      await api.post('/enrollments/self', {
        courseId: course.id,
      });
    } catch (error: any) {
      // Если уже записан или другая бизнес-ошибка - просто переходим в кабинет
      // (backend вернет сообщение, но доступ уже может быть)
      // Можно добавить показ тоста здесь
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/courses" className="text-sm text-muted-foreground hover:text-primary mb-6 inline-block">
            ← {t.courseDetail.backToCourses}
          </Link>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-8">
            <div className="md:col-span-2">
              {course.thumbnail && (
                <div className="w-full h-64 sm:h-80 bg-muted rounded-lg overflow-hidden mb-6">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{course.title}</h1>
              
              {course.description && (
                <div className="prose max-w-none mb-6">
                  <p className="text-base sm:text-lg text-muted-foreground whitespace-pre-line">
                    {course.description}
                  </p>
                </div>
              )}

              {currentLesson && (
                <div className="mb-10" data-protected-content>
                  <h2 className="text-2xl font-bold mb-4">
                    {t.courseDetail.lesson} {currentLesson.order}: {currentLesson.title}
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

                  {currentLesson.duration && (
                    <div className="text-sm text-muted-foreground">
                      ⏱️ {formatDuration(currentLesson.duration)}
                    </div>
                  )}
                </div>
              )}

              {sortedLessons.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">{t.courseDetail.curriculum}</h2>
                  <div className="space-y-3">
                    {sortedLessons.map((lesson, index) => {
                      const isActive = currentLesson?.id === lesson.id;
                      return (
                        <Card
                          key={lesson.id}
                          className={`border-l-4 border-l-primary cursor-pointer transition-colors ${
                            isActive ? 'bg-orange-50/70' : 'hover:bg-muted/60'
                          }`}
                          onClick={() => setSelectedLesson(lesson)}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-semibold text-muted-foreground">
                                    {t.courseDetail.lesson} {index + 1}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 text-xs rounded ${
                                      lesson.type === 'VIDEO'
                                        ? 'bg-blue-100 text-blue-700'
                                        : lesson.type === 'TEXT'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-purple-100 text-purple-700'
                                    }`}
                                  >
                                    {lesson.type === 'VIDEO'
                                      ? t.courseDetail.video
                                      : lesson.type === 'TEXT'
                                      ? t.courseDetail.text
                                      : t.courseDetail.quiz}
                                  </span>
                                </div>
                                <CardTitle className="text-lg">{lesson.title}</CardTitle>
                                {lesson.description && (
                                  <CardDescription className="mt-2">
                                    {lesson.description}
                                  </CardDescription>
                                )}
                              </div>
                              {lesson.duration && (
                                <span className="text-sm text-muted-foreground">
                                  {formatDuration(lesson.duration)}
                                </span>
                              )}
                            </div>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>{t.courseDetail.courseInfo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {formatPrice(course.price)}
                    </div>
                    {course.priceInstallment && (
                      <div className="text-sm text-muted-foreground">
                        {t.courseDetail.installment} {formatPrice(course.priceInstallment)}
                      </div>
                    )}
                  </div>

                  {sortedLessons.length > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{t.courseDetail.lessonsInCourse}</div>
                      <div className="text-lg font-semibold">{sortedLessons.length}</div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Button className="w-full" size="lg" onClick={handleEnrollClick}>
                      {t.courseDetail.enroll}
                    </Button>
                  </div>
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

