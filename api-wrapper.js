/**
 * Universal API Wrapper
 * Works with both server (Express) and static hosting (GitHub Pages, Live Server)
 * Falls back to localStorage when server is unavailable
 */

// Detect if we're running on a server or static hosting
const isServerAvailable = (() => {
  // Try to detect if we're on localhost with a server
  // This is a simple check - in production you might want more sophisticated detection
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
})();

// Base API URL - empty for relative paths
const API_BASE = '';

/**
 * Check if server is actually available by making a test request
 */
async function checkServerAvailability() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); // 1 second timeout
    
    const response = await fetch(`${API_BASE}/api/health`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Get users from localStorage
 */
function getUsersFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('aiwallet_users') || '[]');
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return [];
  }
}

/**
 * Save users to localStorage
 */
function saveUsersToStorage(users) {
  try {
    localStorage.setItem('aiwallet_users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
}

/**
 * API wrapper for registration
 */
async function apiRegister(email, username, password) {
  // Try server first if available
  if (isServerAvailable) {
    try {
      const response = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, username, password }),
        signal: (() => {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), 3000);
          return controller.signal;
        })()
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Also save to localStorage for backup
          const users = getUsersFromStorage();
          const newUser = {
            id: data.userId,
            email,
            username,
            password: btoa(password), // Simple encoding
            createdAt: new Date().toISOString()
          };
          users.push(newUser);
          saveUsersToStorage(users);
          return data;
        }
        return data;
      }
    } catch (error) {
      console.warn('Server unavailable, using localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  const users = getUsersFromStorage();
  
  // Check if user already exists
  const userExists = users.some(user => user.email === email || user.username === username);
  if (userExists) {
    return { success: false, message: 'User already exists' };
  }
  
  // Validate password
  if (password.length < 8) {
    return { success: false, message: 'Password must be at least 8 characters' };
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    email,
    username,
    password: btoa(password),
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsersToStorage(users);
  
  return {
    success: true,
    message: 'Registration successful',
    userId: newUser.id
  };
}

/**
 * API wrapper for login
 */
async function apiLogin(emailOrUsername, password) {
  // Try server first if available
  if (isServerAvailable) {
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailOrUsername, password }),
        signal: (() => {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), 3000);
          return controller.signal;
        })()
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Also sync to localStorage
          const users = getUsersFromStorage();
          let user = users.find(u => u.id === data.userId);
          if (!user) {
            // User doesn't exist in localStorage, create it
            user = {
              id: data.userId,
              email: data.email,
              username: data.username,
              password: btoa(password),
              userPlan: data.userPlan || null,
              planPurchaseDate: data.planPurchaseDate || null,
              createdAt: new Date().toISOString()
            };
            users.push(user);
          } else {
            // Update user data from server
            user.userPlan = data.userPlan || user.userPlan || null;
            user.planPurchaseDate = data.planPurchaseDate || user.planPurchaseDate || null;
          }
          saveUsersToStorage(users);
          return data;
        }
        return data;
      }
    } catch (error) {
      console.warn('Server unavailable, using localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  const users = getUsersFromStorage();
  const user = users.find(u => u.email === emailOrUsername || u.username === emailOrUsername);
  
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  
  // Check password
  const storedPassword = atob(user.password);
  if (storedPassword !== password) {
    return { success: false, message: 'Invalid password' };
  }
  
  return {
    success: true,
    message: 'Login successful',
    userId: user.id,
    username: user.username,
    email: user.email,
    userPlan: user.userPlan || null,
    planPurchaseDate: user.planPurchaseDate || null
  };
}

/**
 * API wrapper for getting user data
 */
async function apiGetUser(userId) {
  // Try server first if available
  if (isServerAvailable) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE}/api/user/${userId}`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Sync to localStorage
          const users = getUsersFromStorage();
          const userIndex = users.findIndex(u => u.id === userId);
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...data.user };
            saveUsersToStorage(users);
          }
          return data;
        }
        return data;
      }
    } catch (error) {
      console.warn('Server unavailable, using localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  const users = getUsersFromStorage();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  
  // Don't send password
  const { password, ...userWithoutPassword } = user;
  
  return {
    success: true,
    user: userWithoutPassword
  };
}

/**
 * API wrapper for updating subscription
 */
async function apiUpdateSubscription(userId, userPlan, planPurchaseDate) {
  // Update localStorage first
  const users = getUsersFromStorage();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.userPlan = userPlan || null;
    user.planPurchaseDate = planPurchaseDate || null;
    saveUsersToStorage(users);
  }
  
  // Also update localStorage directly
  if (userPlan) {
    localStorage.setItem('userPlan', userPlan);
  } else {
    localStorage.removeItem('userPlan');
  }
  if (planPurchaseDate) {
    localStorage.setItem('planPurchaseDate', planPurchaseDate);
  } else {
    localStorage.removeItem('planPurchaseDate');
  }
  
  // Try server if available
  if (isServerAvailable) {
    try {
      const response = await fetch(`${API_BASE}/api/user/${userId}/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userPlan: userPlan || null,
          planPurchaseDate: planPurchaseDate || null
        }),
        signal: (() => {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), 3000);
          return controller.signal;
        })()
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.warn('Server unavailable, subscription saved to localStorage:', error);
    }
  }
  
  // Return success even if server is unavailable
  return {
    success: true,
    message: 'Subscription updated'
  };
}

/**
 * API wrapper for canceling subscription
 */
async function apiCancelSubscription(userId) {
  // Update localStorage first
  const users = getUsersFromStorage();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.userPlan = null;
    user.planPurchaseDate = null;
    saveUsersToStorage(users);
  }
  
  // Also update localStorage directly
  localStorage.removeItem('userPlan');
  localStorage.removeItem('planPurchaseDate');
  
  // Try server if available
  if (isServerAvailable) {
    try {
      const response = await fetch(`${API_BASE}/api/user/${userId}/subscription`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: (() => {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), 3000);
          return controller.signal;
        })()
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.warn('Server unavailable, subscription cancelled in localStorage:', error);
    }
  }
  
  // Return success even if server is unavailable
  return {
    success: true,
    message: 'Subscription cancelled'
  };
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
  window.apiWrapper = {
    register: apiRegister,
    login: apiLogin,
    getUser: apiGetUser,
    updateSubscription: apiUpdateSubscription,
    cancelSubscription: apiCancelSubscription,
    checkServerAvailability
  };
}

