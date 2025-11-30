/**
 * ================================================================================
 * РУССКИЕ КОММЕНТАРИИ - МОДУЛЬ АУТЕНТИФИКАЦИИ
 * ================================================================================
 * 
 * ОБОЗНАЧЕНИЕ МОДУЛЯ: Authentication Module - Управление пользователями на сервере
 * 
 * НАЗНАЧЕНИЕ: Этот модуль отвечает за безопасность и управление аккаунтами:
 *   - Регистрация новых пользователей
 *   - Аутентификация (вход) существующих пользователей
 *   - Хранение данных пользователей в JSON файле (users.json)
 *   - Валидация входных данных (email, пароль, имя пользователя)
 *   - Проверка уникальности учётных данных
 *
 * ОСНОВНЫЕ ФУНКЦИИ:
 *
 * 1. РАБОТА С БД (Database Operations)
 *    - readDatabase(): чтение файла users.json
 *    - saveDatabase(): сохранение файла users.json
 *
 * 2. РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ (User Registration)
 *    - register(email, username, password): создание нового аккаунта
 *    - Валидация: пароль ≥ 8 символов
 *    - Проверка: email и username уникальны
 *    - Шифрование: простое base64 (на production использовать bcrypt)
 *    - Возвращает: userId нового пользователя
 *
 * 3. АУТЕНТИФИКАЦИЯ (User Login)
 *    - login(email, password): вход в аккаунт
 *    - Проверка: email существует в БД
 *    - Проверка: пароль совпадает (base64 сравнение)
 *    - Возвращает: userId для localStorage
 *
 * ХРАНИЛИЩЕ ДАННЫХ (Data Structure):
 *   users.json содержит:
 *   {
 *     "users": [
 *       {
 *         "id": "timestamp",
 *         "email": "user@example.com",
 *         "username": "username",
 *         "password": "base64_encoded_password",
 *         "createdAt": "ISO_date_string"
 *       }
 *     ]
 *   }
 *
 * ПРИМЕЧАНИЕ: Для production сервера:
 *   - Использовать bcrypt для хеширования паролей
 *   - Использовать JWT токены для сессий
 *   - Добавить HTTPS и CORS защиту
 *   - Использовать PostgreSQL/MongoDB вместо JSON файла
 *
 * ================================================================================
 */

const fs = require('fs');
const path = require('path');

// Путь к файлу базы данных
const dbPath = path.join(__dirname, 'users.json');

// Функция чтения базы данных
function readDatabase() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [] };
  }
}

// Функция сохранения базы данных
function saveDatabase(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

// Функция регистрации
function register(email, username, password) {
  const db = readDatabase();
  
  // Проверка существования пользователя
  const userExists = db.users.some(user => user.email === email || user.username === username);
  if (userExists) {
    return { success: false, message: 'User already exists' };
  }
  
  // Проверка пароля
  if (password.length < 8) {
    return { success: false, message: 'Password must be at least 8 characters' };
  }
  
  // Добавление нового пользователя
  const newUser = {
    id: Date.now().toString(),
    email,
    username,
    password: Buffer.from(password).toString('base64'), // Простое шифрование (в реальности нужно использовать bcrypt)
    createdAt: new Date().toISOString()
  };
  
  db.users.push(newUser);
  saveDatabase(db);
  
  return { success: true, message: 'Registration successful', userId: newUser.id };
}

// Функция логина
function login(emailOrUsername, password) {
  const db = readDatabase();
  
  // Поиск пользователя
  const user = db.users.find(u => u.email === emailOrUsername || u.username === emailOrUsername);
  
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  
  // Проверка пароля
  const decryptedPassword = Buffer.from(user.password, 'base64').toString('utf8');
  if (decryptedPassword !== password) {
    return { success: false, message: 'Invalid password' };
  }
  
  return { success: true, message: 'Login successful', userId: user.id, username: user.username };
}

module.exports = { register, login, readDatabase, saveDatabase };
