# 🚀 JapJaryq Academy - API Documentation

## 📋 Базовый URL
- **Development**: `http://localhost:5001/api`
- **Production**: `TBD`

## 🔐 Аутентификация

Все защищенные endpoints требуют JWT токен в cookie `accessToken`.

### Роли:
- `USER` - обычный пользователь
- `ADMIN` - администратор

---

## 📚 API Endpoints

### 1. **Аутентификация** (`/api/auth`)

#### POST `/auth/register`
Регистрация нового пользователя
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Иван",
  "lastName": "Иванов"
}

Response:
{
  "user": { "id": "...", "email": "...", "role": "USER" },
  "accessToken": "..."
}
```

#### POST `/auth/login`
Вход в систему
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": { "id": "...", "email": "...", "role": "USER" },
  "accessToken": "..."
}
```

#### POST `/auth/refresh`
Обновление токена

#### POST `/auth/logout`
Выход из системы

#### GET `/auth/me`
Получение текущего пользователя (требует auth)

---

### 2. **Курсы** (`/api/courses`)

#### GET `/courses`
Получение всех курсов (опубликованные для USER, все для ADMIN)

#### GET `/courses/:id`
Получение курса по ID

#### GET `/courses/my-courses` 🔒
Получение курсов пользователя (требует auth)

#### POST `/courses` 🔒👑
Создание курса (только ADMIN)
```json
Request:
{
  "title": "Основы электрики",
  "description": "Полный курс...",
  "price": 25000,
  "thumbnail": "https://...",
  "isPublished": true
}
```

#### PUT `/courses/:id` 🔒👑
Обновление курса (только ADMIN)

#### DELETE `/courses/:id` 🔒👑
Удаление курса (только ADMIN)

---

### 3. **Уроки** (`/api/lessons`)

#### GET `/lessons/course/:courseId` 🔒
Получение уроков курса

#### GET `/lessons/:id` 🔒
Получение урока по ID

#### POST `/lessons` 🔒👑
Создание урока (только ADMIN)
```json
Request:
{
  "title": "Введение",
  "description": "Первый урок",
  "courseId": "...",
  "type": "VIDEO", // VIDEO | TEXT | QUIZ
  "order": 0,
  "duration": 30,
  "isPublished": true
}
```

#### PUT `/lessons/:id` 🔒👑
Обновление урока (только ADMIN)

#### DELETE `/lessons/:id` 🔒👑
Удаление урока (только ADMIN)

#### POST `/lessons/course/:courseId/reorder` 🔒👑
Изменение порядка уроков (только ADMIN)

#### POST `/lessons/video` 🔒👑
Создание видео урока (только ADMIN)

#### PUT `/lessons/video/:lessonId` 🔒👑
Обновление видео урока (только ADMIN)

---

### 4. **Тесты** (`/api/tests`)

#### GET `/tests/lesson/:lessonId` 🔒
Получение теста по уроку

#### GET `/tests/:id` 🔒
Получение теста по ID

#### POST `/tests` 🔒👑
Создание теста (только ADMIN)
```json
Request:
{
  "lessonId": "...",
  "title": "Проверка знаний",
  "description": "Тест из 10 вопросов",
  "passingScore": 70,
  "timeLimit": 30
}
```

#### PUT `/tests/:id` 🔒👑
Обновление теста (только ADMIN)

#### DELETE `/tests/:id` 🔒👑
Удаление теста (только ADMIN)

#### POST `/tests/questions` 🔒👑
Создание вопроса (только ADMIN)
```json
Request:
{
  "testId": "...",
  "text": "Какое напряжение в сети?",
  "type": "SINGLE", // SINGLE | MULTIPLE
  "order": 0,
  "points": 10
}
```

#### PUT `/tests/questions/:id` 🔒👑
Обновление вопроса (только ADMIN)

#### DELETE `/tests/questions/:id` 🔒👑
Удаление вопроса (только ADMIN)

#### POST `/tests/answers` 🔒👑
Создание ответа (только ADMIN)
```json
Request:
{
  "questionId": "...",
  "text": "220В",
  "isCorrect": true,
  "order": 0
}
```

#### PUT `/tests/answers/:id` 🔒👑
Обновление ответа (только ADMIN)

#### DELETE `/tests/answers/:id` 🔒👑
Удаление ответа (только ADMIN)

#### POST `/tests/attempts` 🔒
Отправка ответов на тест
```json
Request:
{
  "testId": "...",
  "answers": [
    {
      "questionId": "...",
      "answerIds": ["..."]
    }
  ]
}

Response:
{
  "attempt": {
    "score": 80,
    "maxScore": 100,
    "passed": true
  }
}
```

#### GET `/tests/:testId/attempts/my` 🔒
Получение своих попыток

#### GET `/tests/:testId/attempts/all` 🔒👑
Получение всех попыток (только ADMIN)

---

### 5. **Прогресс** (`/api/progress`)

#### GET `/progress/course/:courseId` 🔒
Получение прогресса по курсу
```json
Response:
{
  "totalLessons": 10,
  "completedLessons": 5,
  "progressPercentage": 50,
  "lessons": [...]
}
```

#### POST `/progress/lesson/:lessonId/complete` 🔒
Отметить урок как пройденный

#### POST `/progress/lesson/:lessonId/watch` 🔒
Обновить время просмотра

#### GET `/progress/stats/me` 🔒
Статистика пользователя

#### GET `/progress/stats/course/:courseId` 🔒👑
Статистика курса (только ADMIN)

#### GET `/progress/activity/recent` 🔒
Последняя активность

---

### 6. **Видео** (`/api/videos`)

#### GET `/videos/lesson/:lessonId` 🔒
Получение видео по уроку

#### POST `/videos` 🔒👑
Создание видео урока (только ADMIN)

#### PUT `/videos/lesson/:lessonId` 🔒👑
Обновление видео (только ADMIN)

#### DELETE `/videos/lesson/:lessonId` 🔒👑
Удаление видео (только ADMIN)

#### GET `/videos/lesson/:lessonId/signed-url` 🔒
Получение временного URL для просмотра

#### GET `/videos/all` 🔒👑
Все загруженные видео (только ADMIN)

#### GET `/videos/lesson/:lessonId/stats` 🔒👑
Статистика по видео (только ADMIN)

---

### 7. **Платежи** (`/api/payments`)

#### GET `/payments/all` 🔒👑
Все платежи (только ADMIN)

#### GET `/payments/:id` 🔒👑
Платеж по ID (только ADMIN)

#### GET `/payments/my/history` 🔒
История платежей пользователя

#### POST `/payments/create` 🔒
Создание платежа
```json
Request:
{
  "courseId": "...",
  "paymentSystem": "kaspi" // kaspi | halyk | visa
}

Response:
{
  "payment": {...},
  "paymentUrl": "https://..."
}
```

#### PUT `/payments/:id/status` 🔒👑
Обновление статуса платежа (только ADMIN)

#### POST `/payments/grant-access` 🔒👑
Ручное предоставление доступа (только ADMIN)
```json
Request:
{
  "userId": "...",
  "courseId": "...",
  "durationDays": 365
}
```

#### GET `/payments/stats/overview` 🔒👑
Статистика платежей (только ADMIN)

#### POST `/payments/webhook`
Webhook для платежных систем (без auth)

---

### 8. **Доступы** (`/api/enrollments`)

#### GET `/enrollments` 🔒👑
Все записи (только ADMIN)

#### GET `/enrollments/user/:userId` 🔒👑
Записи пользователя (только ADMIN)

#### GET `/enrollments/course/:courseId` 🔒👑
Записи курса (только ADMIN)

#### POST `/enrollments` 🔒👑
Предоставление доступа (только ADMIN)
```json
Request:
{
  "userId": "...",
  "courseId": "...",
  "expiresAt": "2025-12-31" // optional
}
```

#### PUT `/enrollments/:userId/:courseId` 🔒👑
Обновление доступа (только ADMIN)

#### DELETE `/enrollments/:userId/:courseId` 🔒👑
Отзыв доступа (только ADMIN)

#### GET `/enrollments/check/:userId/:courseId` 🔒
Проверка доступа

#### GET `/enrollments/expiring?days=7` 🔒👑
Истекающие доступы (только ADMIN)

---

### 9. **Пользователи** (`/api/users`)

#### GET `/users` 🔒👑
Все пользователи (только ADMIN)

#### GET `/users/:id` 🔒👑
Пользователь по ID (только ADMIN)

#### PUT `/users/:id/role` 🔒👑
Изменение роли (только ADMIN)
```json
Request:
{
  "role": "ADMIN" // USER | ADMIN
}
```

#### PUT `/users/:id` 🔒👑
Обновление профиля (только ADMIN)

#### DELETE `/users/:id` 🔒👑
Удаление пользователя (только ADMIN)

#### GET `/users/stats/overview` 🔒👑
Статистика пользователей (только ADMIN)

---

## 🔑 Легенда

- 🔒 - Требуется авторизация
- 👑 - Требуются права администратора
- Без иконок - Публичный endpoint

---

## ⚠️ Коды ошибок

- `200` - Успешно
- `201` - Создано
- `400` - Неверный запрос
- `401` - Не авторизован
- `403` - Доступ запрещен
- `404` - Не найдено
- `500` - Ошибка сервера

---

## 📝 Примеры использования

### Регистрация и вход:
```bash
# Регистрация
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","firstName":"Test"}'

# Вход
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}' \
  -c cookies.txt

# Использование токена
curl -X GET http://localhost:5001/api/auth/me \
  -b cookies.txt
```

### Работа с курсами:
```bash
# Получение всех курсов
curl http://localhost:5001/api/courses

# Создание курса (требует ADMIN)
curl -X POST http://localhost:5001/api/courses \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Новый курс","price":15000,"isPublished":true}'
```

---

**Дата обновления**: 26 декабря 2024  
**Версия API**: 1.0.0



