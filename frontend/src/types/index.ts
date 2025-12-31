export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'ADMIN';
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price: number;
  priceInstallment?: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  order: number;
  duration?: number;
  type: 'VIDEO' | 'TEXT' | 'QUIZ';
  isPublished: boolean;
  videoLesson?: VideoLesson;
  test?: Test;
}

export interface VideoLesson {
  id: string;
  lessonId: string;
  gcsPath: string;
  playlistPath: string;
  duration?: number;
}

export interface Test {
  id: string;
  lessonId: string;
  title: string;
  passingScore: number;
  isRequired: boolean;
  blocksNextLesson: boolean;
  questions?: Question[];
}

export interface Question {
  id: string;
  testId: string;
  text: string;
  order: number;
  answers: Answer[];
}

export interface Answer {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
}

export interface UserProgress {
  lessonId: string;
  title: string;
  order: number;
  progress: {
    isCompleted: boolean;
    watchedTime: number;
  };
}

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentSystem: string;
  transactionId?: string;
  createdAt: string;
  course?: Course;
}



