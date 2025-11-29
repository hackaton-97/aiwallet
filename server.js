const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const dbPath = path.join(__dirname, 'users.json');

// Функция чтения БД
function readDatabase() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [] };
  }
}

// Функция сохранения БД
function saveDatabase(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

// API для регистрации
app.post('/api/register', (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.json({ success: false, message: 'All fields are required' });
  }

  const db = readDatabase();

  // Проверка существования пользователя
  const userExists = db.users.some(user => user.email === email || user.username === username);
  if (userExists) {
    return res.json({ success: false, message: 'User already exists' });
  }

  // Проверка пароля
  if (password.length < 8) {
    return res.json({ success: false, message: 'Password must be at least 8 characters' });
  }

  // Добавление нового пользователя
  const newUser = {
    id: Date.now().toString(),
    email,
    username,
    password: Buffer.from(password).toString('base64'),
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDatabase(db);

  return res.json({ success: true, message: 'Registration successful', userId: newUser.id });
});

// API для логина
app.post('/api/login', (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.json({ success: false, message: 'Email/Username and password are required' });
  }

  const db = readDatabase();

  // Поиск пользователя
  const user = db.users.find(u => u.email === emailOrUsername || u.username === emailOrUsername);

  if (!user) {
    return res.json({ success: false, message: 'User not found' });
  }

  // Проверка пароля
  const decryptedPassword = Buffer.from(user.password, 'base64').toString('utf8');
  if (decryptedPassword !== password) {
    return res.json({ success: false, message: 'Invalid password' });
  }

  return res.json({ 
    success: true, 
    message: 'Login successful', 
    userId: user.id, 
    username: user.username,
    email: user.email,
    userPlan: user.userPlan || null,
    planPurchaseDate: user.planPurchaseDate || null
  });
});

// API для получения информации о пользователе
app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params;
  const db = readDatabase();
  
  const user = db.users.find(u => u.id === userId);
  
  if (!user) {
    return res.json({ success: false, message: 'User not found' });
  }
  
  // Не отправляем пароль
  const { password, ...userWithoutPassword } = user;
  return res.json({ success: true, user: userWithoutPassword });
});

// API для обновления подписки пользователя
app.post('/api/user/:userId/subscription', (req, res) => {
  const { userId } = req.params;
  const { userPlan, planPurchaseDate } = req.body;
  
  const db = readDatabase();
  const user = db.users.find(u => u.id === userId);
  
  if (!user) {
    return res.json({ success: false, message: 'User not found' });
  }
  
  user.userPlan = userPlan || null;
  user.planPurchaseDate = planPurchaseDate || null;
  
  saveDatabase(db);
  
  return res.json({ success: true, message: 'Subscription updated' });
});

// API для отмены подписки
app.delete('/api/user/:userId/subscription', (req, res) => {
  const { userId } = req.params;
  
  const db = readDatabase();
  const user = db.users.find(u => u.id === userId);
  
  if (!user) {
    return res.json({ success: false, message: 'User not found' });
  }
  
  user.userPlan = null;
  user.planPurchaseDate = null;
  
  saveDatabase(db);
  
  return res.json({ success: true, message: 'Subscription cancelled' });
});

// Health check endpoint for API wrapper
app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok', server: 'available' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
