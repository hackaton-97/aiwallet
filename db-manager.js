/**
 * ================================================================================
 * РУССКИЕ КОММЕНТАРИИ - МЕНЕДЖЕР БАЗ ДАННЫХ
 * ================================================================================
 * 
 * ОБОЗНАЧЕНИЕ МОДУЛЯ: DBManager - Управление данными приложения
 * 
 * НАЗНАЧЕНИЕ: Этот модуль отвечает за все операции с данными приложения:
 *   - Инициализация базы данных
 *   - CRUD операции с пользователями
 *   - CRUD операции с финансовыми планами
 *   - CRUD операции с обмениваемыми планами
 *   - Синхронизация данных с localStorage
 *
 * ОСНОВНЫЕ КОМПОНЕНТЫ:
 *
 * 1. ИНИЦИАЛИЗАЦИЯ И ЗАГРУЗКА (Initialization)
 *    - init(): загрузка БД из database.json при первом запуске
 *    - getDB(): получение текущей БД из localStorage
 *    - saveDB(): сохранение БД в localStorage
 *    - createEmptyDatabase(): создание пустой структуры БД
 *
 * 2. ОПЕРАЦИИ С ПОЛЬЗОВАТЕЛЯМИ (User Operations)
 *    - addUser(): добавление нового пользователя
 *    - getUser(): получение данных пользователя по ID
 *    - updateUser(): обновление информации пользователя
 *    - deleteUser(): удаление пользователя и его данных
 *    - userExists(): проверка существования пользователя
 *
 * 3. ОПЕРАЦИИ С ПЛАНАМИ (Plan Operations)
 *    - addPlan(): добавление нового финансового плана
 *    - getPlan(): получение плана по ID
 *    - updatePlan(): обновление параметров плана
 *    - deletePlan(): удаление плана
 *    - getUserPlans(): получение всех планов пользователя
 *
 * 4. ОПЕРАЦИИ С ОБМЕНИВАЕМЫМИ ПЛАНАМИ (Shared Plans)
 *    - shareWithUser(): совместный доступ к плану
 *    - getSharedPlans(): получение планов, открытых другими пользователями
 *    - unshareWithUser(): отмена совместного доступа
 *
 * ХРАНИЛИЩЕ ДАННЫХ (Data Storage):
 *   Используется localStorage с ключами:
 *   - aiwallet_db: основная база данных (структура, все данные)
 *   - userId: текущий пользователь (сессия)
 *   - username: имя текущего пользователя
 *   - email: email текущего пользователя
 *   - financial_plans_db: планы пользователей (альтернативное хранилище)
 *   - purchase_records_db: записи о покупках и расходах
 *
 * ПРИМЕЧАНИЕ: На production сервере эти операции должны быть 
 * заменены на API вызовы к Node.js/Express backend
 *
 * ================================================================================
 */

/**
 * Database Manager for AIWallet
 * Handles all database operations with localStorage as primary storage
 * For deployment: Replace localStorage calls with API calls to Node.js backend
 */

const DBManager = {
  // Initialize database from JSON
  init: async function() {
    try {
      // Check if we have cached database
      const cachedDB = localStorage.getItem('aiwallet_db');
      if (!cachedDB) {
        // Load from database.json (for initial setup)
        const response = await fetch('database.json');
        const db = await response.json();
        localStorage.setItem('aiwallet_db', JSON.stringify(db));
      }
    } catch (error) {
      console.warn('Could not load database.json, using empty structure:', error);
      this.createEmptyDatabase();
    }
  },

  // Get the current database
  getDB: function() {
    const db = localStorage.getItem('aiwallet_db');
    return db ? JSON.parse(db) : this.createEmptyDatabase();
  },

  // Save database to localStorage
  saveDB: function(db) {
    localStorage.setItem('aiwallet_db', JSON.stringify(db));
    // In production, send to server: POST /api/db/save
  },

  // Create empty database structure
  createEmptyDatabase: function() {
    const db = {
      users: [],
      plans: [],
      sharedPlans: [],
      apiVersion: "1.0",
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('aiwallet_db', JSON.stringify(db));
    return db;
  },

  // USER OPERATIONS
  registerUser: function(email, username, password) {
    const db = this.getDB();
    
    // Check if user already exists
    if (db.users.some(u => u.email === email || u.username === username)) {
      return { success: false, message: 'Email or username already exists' };
    }

    const userId = Date.now().toString();
    const newUser = {
      id: userId,
      email: email,
      username: username,
      password: btoa(password), // Base64 encoding (not secure for production!)
      createdAt: new Date().toISOString(),
      plans: [],
      sharedPlans: []
    };

    db.users.push(newUser);
    db.lastUpdated = new Date().toISOString();
    this.saveDB(db);

    return { 
      success: true, 
      userId: userId,
      message: 'User registered successfully'
    };
  },

  // Login user
  loginUser: function(emailOrUsername, password) {
    const db = this.getDB();
    const user = db.users.find(u => u.email === emailOrUsername || u.username === emailOrUsername);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const storedPassword = atob(user.password);
    if (storedPassword !== password) {
      return { success: false, message: 'Invalid password' };
    }

    return {
      success: true,
      userId: user.id,
      username: user.username,
      email: user.email
    };
  },

  // Get user by ID
  getUser: function(userId) {
    const db = this.getDB();
    return db.users.find(u => u.id === userId);
  },

  // PLAN OPERATIONS
  createPlan: function(userId, name, description, content) {
    const db = this.getDB();
    const user = db.users.find(u => u.id === userId);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const planId = `plan_${Date.now()}`;
    const newPlan = {
      id: planId,
      userId: userId,
      name: name,
      description: description,
      content: content,
      createdAt: new Date().toISOString(),
      sharedWith: []
    };

    db.plans.push(newPlan);
    user.plans.push(planId);
    db.lastUpdated = new Date().toISOString();
    this.saveDB(db);

    return { success: true, planId: planId, plan: newPlan };
  },

  // Get user's plans
  getUserPlans: function(userId) {
    const db = this.getDB();
    const user = db.users.find(u => u.id === userId);

    if (!user) return [];

    return db.plans.filter(p => p.userId === userId);
  },

  // Get plan by ID
  getPlan: function(planId) {
    const db = this.getDB();
    return db.plans.find(p => p.id === planId);
  },

  // Update plan
  updatePlan: function(planId, updates) {
    const db = this.getDB();
    const plan = db.plans.find(p => p.id === planId);

    if (!plan) {
      return { success: false, message: 'Plan not found' };
    }

    Object.assign(plan, updates);
    db.lastUpdated = new Date().toISOString();
    this.saveDB(db);

    return { success: true, plan: plan };
  },

  // Delete plan
  deletePlan: function(planId) {
    const db = this.getDB();
    const planIndex = db.plans.findIndex(p => p.id === planId);

    if (planIndex === -1) {
      return { success: false, message: 'Plan not found' };
    }

    const plan = db.plans[planIndex];
    
    // Remove from user's plans list
    const user = db.users.find(u => u.id === plan.userId);
    if (user) {
      user.plans = user.plans.filter(id => id !== planId);
    }

    // Remove all shares of this plan
    db.sharedPlans = db.sharedPlans.filter(sp => sp.planId !== planId);

    db.plans.splice(planIndex, 1);
    db.lastUpdated = new Date().toISOString();
    this.saveDB(db);

    return { success: true };
  },

  // SHARING OPERATIONS
  sharePlan: function(planId, ownerId, targetEmail, accessLevel = 'view') {
    const db = this.getDB();
    const plan = db.plans.find(p => p.id === planId);
    const targetUser = db.users.find(u => u.email === targetEmail);

    if (!plan) {
      return { success: false, message: 'Plan not found' };
    }

    if (!targetUser) {
      return { success: false, message: 'User with this email not found' };
    }

    if (plan.userId !== ownerId) {
      return { success: false, message: 'You do not own this plan' };
    }

    // Check if already shared
    if (plan.sharedWith.some(s => s.userId === targetUser.id)) {
      return { success: false, message: 'Plan already shared with this user' };
    }

    const shareId = `share_${Date.now()}`;
    const shareRecord = {
      id: shareId,
      planId: planId,
      ownerId: ownerId,
      ownerUsername: db.users.find(u => u.id === ownerId).username,
      sharedWithUserId: targetUser.id,
      sharedWithEmail: targetEmail,
      accessLevel: accessLevel,
      sharedAt: new Date().toISOString()
    };

    db.sharedPlans.push(shareRecord);
    plan.sharedWith.push({
      userId: targetUser.id,
      email: targetEmail,
      accessLevel: accessLevel,
      sharedAt: new Date().toISOString()
    });

    if (!targetUser.sharedPlans) {
      targetUser.sharedPlans = [];
    }
    targetUser.sharedPlans.push(shareId);

    db.lastUpdated = new Date().toISOString();
    this.saveDB(db);

    return { success: true, shareId: shareId };
  },

  // Get shared plans for user
  getSharedPlans: function(userId) {
    const db = this.getDB();
    const sharedPlanIds = db.sharedPlans.filter(sp => sp.sharedWithUserId === userId);
    
    return sharedPlanIds.map(sp => {
      const plan = db.plans.find(p => p.id === sp.planId);
      return {
        ...plan,
        sharedBy: sp.ownerUsername,
        sharedAt: sp.sharedAt,
        accessLevel: sp.accessLevel,
        shareId: sp.id
      };
    });
  },

  // Unshare plan
  unsharePlan: function(planId, targetUserId) {
    const db = this.getDB();
    const plan = db.plans.find(p => p.id === planId);

    if (!plan) {
      return { success: false, message: 'Plan not found' };
    }

    plan.sharedWith = plan.sharedWith.filter(s => s.userId !== targetUserId);
    
    const shareIndex = db.sharedPlans.findIndex(
      sp => sp.planId === planId && sp.sharedWithUserId === targetUserId
    );
    
    if (shareIndex !== -1) {
      const shareId = db.sharedPlans[shareIndex].id;
      db.sharedPlans.splice(shareIndex, 1);
      
      const targetUser = db.users.find(u => u.id === targetUserId);
      if (targetUser && targetUser.sharedPlans) {
        targetUser.sharedPlans = targetUser.sharedPlans.filter(id => id !== shareId);
      }
    }

    db.lastUpdated = new Date().toISOString();
    this.saveDB(db);

    return { success: true };
  },

  // Get all public plans (for browse)
  getPublicPlans: function() {
    const db = this.getDB();
    return db.plans.filter(p => p.isPublic === true);
  }
};

// Initialize on page load
window.addEventListener('load', function() {
  DBManager.init();
});
