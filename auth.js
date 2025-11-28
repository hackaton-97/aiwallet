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
