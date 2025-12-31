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

interface Test {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  questions: Question[];
}

interface Question {
  id: string;
  testId: string;
  text: string;
  type: 'SINGLE' | 'MULTIPLE';
  order: number;
  points: number;
  answers: Answer[];
}

interface Answer {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

export default function AdminTestsPage() {
  const router = useRouter();
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTestForm, setShowTestForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Форма теста
  const [testTitle, setTestTitle] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [passingScore, setPassingScore] = useState('');
  const [timeLimit, setTimeLimit] = useState('');

  // Форма вопроса
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<'SINGLE' | 'MULTIPLE'>('SINGLE');
  const [questionPoints, setQuestionPoints] = useState('1');
  const [answers, setAnswers] = useState<{ text: string; isCorrect: boolean }[]>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);

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

  const fetchTest = async (lessonId: string) => {
    try {
      const response = await api.get(`/tests/lesson/${lessonId}`);
      setTest(response.data.test);
    } catch (error) {
      console.error('Ошибка загрузки теста:', error);
      setTest(null);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setSelectedLesson(null);
    setTest(null);
    fetchLessons(course.id);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    fetchTest(lesson.id);
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLesson) return;

    try {
      const response = await api.post('/tests', {
        lessonId: selectedLesson.id,
        title: testTitle,
        description: testDescription,
        passingScore: parseInt(passingScore),
        timeLimit: timeLimit ? parseInt(timeLimit) : undefined,
      });

      setTest(response.data.test);
      setShowTestForm(false);
      resetTestForm();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка создания теста');
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!test) return;

    try {
      const response = await api.post('/tests/questions', {
        testId: test.id,
        text: questionText,
        type: questionType,
        order: test.questions.length,
        points: parseInt(questionPoints),
      });

      const newQuestion = response.data.question;

      // Создаем ответы
      for (let i = 0; i < answers.length; i++) {
        if (answers[i].text.trim()) {
          await api.post('/tests/answers', {
            questionId: newQuestion.id,
            text: answers[i].text,
            isCorrect: answers[i].isCorrect,
            order: i,
          });
        }
      }

      fetchTest(selectedLesson!.id);
      setShowQuestionForm(false);
      resetQuestionForm();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка создания вопроса');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Удалить вопрос?')) return;

    try {
      await api.delete(`/tests/questions/${questionId}`);
      if (selectedLesson) {
        fetchTest(selectedLesson.id);
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка удаления');
    }
  };

  const resetTestForm = () => {
    setTestTitle('');
    setTestDescription('');
    setPassingScore('');
    setTimeLimit('');
  };

  const resetQuestionForm = () => {
    setQuestionText('');
    setQuestionType('SINGLE');
    setQuestionPoints('1');
    setAnswers([
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]);
    setEditingQuestion(null);
  };

  const addAnswer = () => {
    setAnswers([...answers, { text: '', isCorrect: false }]);
  };

  const removeAnswer = (index: number) => {
    setAnswers(answers.filter((_, i) => i !== index));
  };

  const updateAnswer = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setAnswers(newAnswers);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">✅ Управление тестами</h1>
          <Link href="/admin" className="text-sm text-primary hover:underline">
            ← Назад в админку
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Курсы */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Курсы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => handleCourseSelect(course)}
                    className={`w-full text-left p-2 rounded text-sm border transition-colors ${
                      selectedCourse?.id === course.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    {course.title}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Уроки */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Уроки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
                {!selectedCourse ? (
                  <p className="text-sm text-muted-foreground">Выберите курс</p>
                ) : lessons.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Нет уроков</p>
                ) : (
                  lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson)}
                      className={`w-full text-left p-2 rounded text-sm border transition-colors ${
                        selectedLesson?.id === lesson.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      #{lesson.order} {lesson.title}
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Тест */}
          <div className="lg:col-span-2">
            {!selectedLesson ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Выберите урок для управления тестом
                </CardContent>
              </Card>
            ) : !test ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">Тест еще не создан</p>
                  <Button onClick={() => setShowTestForm(true)}>
                    + Создать тест
                  </Button>
                  {showTestForm && (
                    <form onSubmit={handleCreateTest} className="mt-6 space-y-4 text-left">
                      <div>
                        <label className="text-sm font-medium">Название теста</label>
                        <Input
                          value={testTitle}
                          onChange={(e) => setTestTitle(e.target.value)}
                          required
                          placeholder="Проверка знаний"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Описание</label>
                        <textarea
                          className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={testDescription}
                          onChange={(e) => setTestDescription(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Проходной балл (%)</label>
                          <Input
                            type="number"
                            value={passingScore}
                            onChange={(e) => setPassingScore(e.target.value)}
                            required
                            placeholder="70"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Время (мин)</label>
                          <Input
                            type="number"
                            value={timeLimit}
                            onChange={(e) => setTimeLimit(e.target.value)}
                            placeholder="30"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit">Создать</Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowTestForm(false);
                            resetTestForm();
                          }}
                        >
                          Отмена
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="mb-4">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{test.title}</CardTitle>
                        {test.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {test.description}
                          </p>
                        )}
                      </div>
                      <Button onClick={() => setShowQuestionForm(true)}>
                        + Добавить вопрос
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Проходной балл:</span>
                        <span className="ml-2 font-medium">{test.passingScore}%</span>
                      </div>
                      {test.timeLimit && (
                        <div>
                          <span className="text-muted-foreground">Время:</span>
                          <span className="ml-2 font-medium">{test.timeLimit} мин</span>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Вопросов:</span>
                        <span className="ml-2 font-medium">{test.questions.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {showQuestionForm && (
                  <Card className="mb-4">
                    <CardHeader>
                      <CardTitle className="text-base">Новый вопрос</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCreateQuestion} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Текст вопроса</label>
                          <textarea
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            required
                            placeholder="Какое напряжение в бытовой сети?"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Тип вопроса</label>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={questionType}
                              onChange={(e) => setQuestionType(e.target.value as any)}
                            >
                              <option value="SINGLE">Один ответ</option>
                              <option value="MULTIPLE">Несколько ответов</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Баллы</label>
                            <Input
                              type="number"
                              value={questionPoints}
                              onChange={(e) => setQuestionPoints(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Варианты ответов</label>
                          <div className="space-y-2">
                            {answers.map((answer, index) => (
                              <div key={index} className="flex gap-2">
                                <input
                                  type="checkbox"
                                  checked={answer.isCorrect}
                                  onChange={(e) => updateAnswer(index, 'isCorrect', e.target.checked)}
                                  className="w-4 h-4 mt-2"
                                />
                                <Input
                                  value={answer.text}
                                  onChange={(e) => updateAnswer(index, 'text', e.target.value)}
                                  placeholder={`Вариант ${index + 1}`}
                                  required
                                />
                                {answers.length > 2 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeAnswer(index)}
                                  >
                                    ✕
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addAnswer}
                            className="mt-2"
                          >
                            + Добавить вариант
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit">Создать вопрос</Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowQuestionForm(false);
                              resetQuestionForm();
                            }}
                          >
                            Отмена
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Список вопросов */}
                <div className="space-y-3">
                  {test.questions.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        Вопросов пока нет
                      </CardContent>
                    </Card>
                  ) : (
                    test.questions.map((question, qIndex) => (
                      <Card key={question.id}>
                        <CardContent className="py-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-bold">#{qIndex + 1}</span>
                                <span className="text-sm">{question.text}</span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>
                                  {question.type === 'SINGLE' ? 'Один ответ' : 'Несколько ответов'}
                                </span>
                                <span>Баллов: {question.points}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              Удалить
                            </Button>
                          </div>
                          <div className="ml-6 space-y-1">
                            {question.answers.map((answer, aIndex) => (
                              <div key={answer.id} className="flex items-center gap-2 text-sm">
                                <span className={answer.isCorrect ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                                  {answer.isCorrect ? '✓' : '○'}
                                </span>
                                <span className={answer.isCorrect ? 'font-medium' : ''}>
                                  {answer.text}
                                </span>
                              </div>
                            ))}
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
