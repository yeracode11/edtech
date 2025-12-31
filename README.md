# JapJaryq Academy - Онлайн-школа электриков

Полноценная платформа для онлайн-обучения электриков с видеокурсами, практическими заданиями, тестами и системой оплаты.

## Описание проекта

**JapJaryq Academy** — это современная онлайн-школа для обучения электриков. Студенты могут регистрироваться, выбирать курсы по электрике (от начального до продвинутого уровня), оплачивать их и получать доступ к практическим видеоурокам, схемам и тестам. Администраторы управляют курсами и учениками через встроенную админ-панель.

### Специализация: Электротехника
- Монтаж электропроводки
- Установка электрощитов
- Работа с трехфазными сетями
- Чтение электрических схем
- Техника безопасности
- Современные стандарты ПУЭ

## Архитектура

Проект состоит из двух основных частей:

### Backend
- **Технологии**: Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL
- **Аутентификация**: JWT (access + refresh tokens) в HttpOnly cookies
- **Видео**: Google Cloud Storage с HLS форматом и Signed URLs
- **Платежи**: Интеграция с Kaspi, PayBox и другими платежными системами через webhooks

### Frontend
- **Технологии**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Видеоплеер**: HLS.js для воспроизведения HLS видео
- **Роутинг**: 
  - Публичная часть (лендинг, каталог курсов)
  - Личный кабинет пользователя
  - Админ-панель (`/admin`)

## Основные функции

### Для пользователей
- ✅ Регистрация и авторизация
- ✅ Просмотр каталога курсов
- ✅ Оплата курсов через платежные системы
- ✅ Доступ к видеоурокам в формате HLS
- ✅ Прохождение тестов после уроков
- ✅ Отслеживание прогресса обучения
- ✅ Личный кабинет с доступом к купленным курсам

### Для администраторов
- ✅ Создание и редактирование курсов
- ✅ Загрузка видеоуроков
- ✅ Создание тестов и вопросов
- ✅ Управление пользователями
- ✅ Просмотр платежей и транзакций
- ✅ Ручное предоставление доступов к курсам

## Быстрый старт

### Требования
- Node.js 18+ 
- PostgreSQL 14+
- npm или yarn

### 1. Клонируйте репозиторий

```bash
git clone <repository-url>
cd edtech
```

### 2. Настройка Backend

```bash
cd backend
npm install
cp .env.example .env
# Отредактируйте .env файл с вашими настройками
npm run prisma:migrate
npm run prisma:generate
npm run dev
```

Backend запустится на `http://localhost:5000`

### 3. Настройка Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Отредактируйте .env.local файл
npm run dev
```

Frontend запустится на `http://localhost:3000`

### 4. Создание первого администратора

После запуска обоих серверов:
1. Зарегистрируйтесь через интерфейс
2. Подключитесь к PostgreSQL и выполните:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Структура проекта

```
edtech/
├── backend/                    # Backend приложение
│   ├── src/
│   │   ├── config/            # Конфигурация
│   │   ├── controllers/       # Контроллеры
│   │   ├── services/          # Бизнес-логика
│   │   ├── routes/            # API маршруты
│   │   ├── middlewares/       # Middleware
│   │   ├── utils/             # Утилиты
│   │   └── index.ts           # Точка входа
│   ├── prisma/
│   │   └── schema.prisma      # Схема БД
│   └── package.json
│
├── frontend/                   # Frontend приложение
│   ├── src/
│   │   ├── app/               # Next.js pages (App Router)
│   │   ├── components/        # React компоненты
│   │   ├── lib/               # Библиотеки и утилиты
│   │   ├── hooks/             # Custom hooks
│   │   ├── stores/            # Zustand stores
│   │   └── types/             # TypeScript типы
│   └── package.json
│
└── architecture.md             # Подробная архитектура
```

## База данных

Схема включает следующие основные модели:

- **User** - Пользователи (с ролями USER/ADMIN)
- **Course** - Курсы
- **Lesson** - Уроки
- **VideoLesson** - Видеоуроки (ссылки на GCS)
- **Test** - Тесты
- **Question** - Вопросы тестов
- **Answer** - Варианты ответов
- **Enrollment** - Доступы пользователей к курсам
- **UserProgress** - Прогресс прохождения уроков
- **TestResult** - Результаты тестов
- **Payment** - Платежи
- **RefreshToken** - Refresh токены

## Видео

Видео хранятся в Google Cloud Storage в формате HLS (m3u8 + ts сегменты):

1. Видео конвертируется в HLS с помощью FFmpeg
2. Загружается в приватный GCS bucket
3. При запросе backend генерирует временные Signed URLs (5-10 минут)
4. Frontend воспроизводит видео через hls.js

Это решение защищает видео от простого скачивания и подходит для MVP.

## Платежи

Интеграция с платежными системами реализована через webhooks:

1. Пользователь инициирует платеж
2. Backend создает запись Payment со статусом PENDING
3. Пользователь перенаправляется на страницу оплаты
4. Платежная система отправляет webhook на backend
5. Backend валидирует webhook и обновляет статус платежа
6. При успешной оплате автоматически создается Enrollment

Поддерживаемые системы:
- Kaspi (`/api/payments/webhook/kaspi`)
- PayBox (`/api/payments/webhook/paybox`)

## Разработка

### Backend

```bash
cd backend
npm run dev          # Запуск с hot-reload
npm run build        # Production сборка
npm run prisma:studio # Просмотр БД
```

### Frontend

```bash
cd frontend
npm run dev          # Запуск с hot-reload
npm run build        # Production сборка
npm run lint         # Линтинг
```

## Production деплой

### Backend
1. Настройте PostgreSQL на продакшн-сервере
2. Настройте Google Cloud Storage
3. Выполните миграции Prisma
4. Установите переменные окружения
5. Запустите через pm2 или Docker

### Frontend
1. Соберите production билд (`npm run build`)
2. Деплой на Vercel, Netlify или собственный сервер
3. Настройте переменные окружения

## Безопасность

- ✅ JWT токены в HttpOnly cookies
- ✅ Refresh token rotation
- ✅ CORS настройки
- ✅ Валидация данных на backend
- ✅ SQL injection защита (Prisma)
- ✅ Signed URLs для видео
- ✅ Роли пользователей (USER/ADMIN)
- ✅ Middleware для проверки доступа

## Будущие улучшения

- [ ] Полноценная DRM защита видео
- [ ] Поддержка подписок (не разовые платежи)
- [ ] Email уведомления
- [ ] Сертификаты после завершения курсов
- [ ] Рейтинги и отзывы курсов
- [ ] Форум для обсуждений
- [ ] Мобильное приложение

## Лицензия

Proprietary

## Контакты

Для вопросов и предложений: info@edtech.kz

