/**
 * ================================================================================
 * РУССКИЕ КОММЕНТАРИИ - ОСНОВНАЯ АРХИТЕКТУРА ПРИЛОЖЕНИЯ
 * ================================================================================
 * 
 * ОБОЗНАЧЕНИЕ МОДУЛЯ: AIWallet - Главный скрипт приложения
 * 
 * НАЗНАЧЕНИЕ: Этот файл управляет основной функциональностью приложения:
 *   - Система управления темой (тёмная/светлая)
 *   - Система аутентификации пользователей (вход/выход/удаление)
 *   - Система управления навбаром (показ/скрытие ссылок)
 *   - Система анимаций (плавающие эффекты, переходы)
 *   - Система модальных окон (пользовательские диалоги)
 *   - Система меню профиля (выпадающее меню пользователя)
 *
 * ОСНОВНЫЕ СИСТЕМЫ:
 *
 * 1. СИСТЕМА УПРАВЛЕНИЯ ТЕМОЙ (Theme Management System)
 *    - Сохранение выбранной темы в localStorage
 *    - Применение 'dark' класса к элементу html
 *    - Переключение между тёмным и светлым режимами
 *    - Загрузка сохранённой темы ДО загрузки страницы (предотвращает вспышку)
 *
 * 2. СИСТЕМА АУТЕНТИФИКАЦИИ (Authentication System)
 *    - Проверка статуса входа пользователя (checkUserStatus)
 *    - Обработка входа (handleLogin)
 *    - Обработка выхода (handleLogout)
 *    - Удаление аккаунта (handleDeleteAccount)
 *    - Валидация данных пользователя
 *
 * 3. СИСТЕМА УПРАВЛЕНИЯ НАВБАРОМ (Navbar Management System)
 *    - syncHeaderLinks(): синхронизация видимости ссылок на основе статуса входа
 *    - Скрытие/показ ссылок: Add Purchase, Create Plan, My Plans, Share Plan, Dashboard
 *    - Показ/скрытие кнопок auth (Get Started, Login) в зависимости от статуса
 *    - Показ/скрытие профиля пользователя
 *
 * 4. СИСТЕМА АНИМАЦИЙ (Animation System)
 *    - addFloatingAnimation(): добавление плавающих эффектов на элементы
 *    - Анимация наведения для кнопок (floating up effect)
 *    - Специальная анимация для логотипа AIWallet
 *    - Плавные переходы между состояниями
 *
 * 5. СИСТЕМА МОДАЛЬНЫХ ОКОН (Modal System)
 *    - showCustomModal(): отображение пользовательского модального окна
 *    - closeModal(): закрытие модального окна
 *    - Обработка кликов вне модального окна
 *    - Поддержка callback функций при закрытии
 *
 * 6. СИСТЕМА МЕНЮ ПРОФИЛЯ (Profile Menu System)
 *    - toggleProfileMenu(): включение/отключение меню профиля
 *    - Отображение инициалов пользователя в профиле
 *    - Логин при клике на аватар (если вышли из аккаунта)
 *    - Кнопки: Посмотреть профиль, Выход, Удалить аккаунт
 *
 * ================================================================================
 */

/**
 * ================================================================================
 * AIWALLET APPLICATION - MAIN SCRIPT
 * ================================================================================
 * 
 * OVERVIEW:
 * This script manages the core functionality of the AIWallet application,
 * including authentication, theme management, UI interactions, and navbar updates.
 * 
 * KEY MODULES:
 * 1. Theme Management - Dark/Light mode switching with localStorage persistence
 * 2. Animation Effects - Floating animations for UI elements
 * 3. Authentication Handlers - Login/Logout/Account deletion flows
 * 4. Navbar Management - Dynamic link visibility based on auth status
 * 5. Modal Management - Custom modals for user interactions
 * 6. Profile Dropdown - User menu functionality
 * 
 * ================================================================================
 */

/**
 * INITIALIZATION: Theme Detection
 * Runs before DOMContentLoaded to prevent theme flash
 * Checks localStorage for saved theme preference, defaults to dark mode
 * Adds 'dark' class to html element if dark theme is active
 */
(function() {
  if (typeof document !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    // Default to dark theme if no preference saved
    const isDark = savedTheme ? savedTheme === 'dark' : true;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
})();

/**
 * FUNCTION: addFloatingAnimation()
 * PURPOSE: Applies floating/hover animations to interactive elements
 * ANIMATION EFFECTS:
 * - Buttons: Smooth upward translation on hover
 * - Logo: Subtle upward movement with slight rotation
 * EXCLUSIONS: Header elements, profile menu, auth buttons (these have fixed styling)
 * 
 * TRIGGERS:
 * - Called after page load
 * - Called again after short delays to catch dynamically loaded elements
 */
function addFloatingAnimation() {
  // SECTION: Create and inject CSS animation styles if not already present
  if (!document.getElementById('floatingAnimationStyle')) {
    const style = document.createElement('style');
    style.id = 'floatingAnimationStyle';
    style.textContent = `
      /**
       * FLOATING HOVER ANIMATION
       * Applied to main content buttons and interactive elements
       * Creates smooth upward floating effect on hover
       */
      .floating-hover {
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out !important;
        will-change: transform;
      }
      
      .floating-hover:hover {
        animation: float 2s ease-in-out infinite !important;
        transform: translateY(-3px) !important;
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(-3px);
        }
        50% {
          transform: translateY(-6px);
        }
      }
      
      /**
       * LOGO FLOATING ANIMATION
       * Special animation for AIWallet logo
       * Combines subtle vertical movement with slight rotation
       */
      .logo-floating {
        transition: transform 0.3s ease-in-out !important;
        will-change: transform;
      }
      
      .logo-floating:hover {
        animation: logoFloat 2s ease-in-out infinite !important;
      }
      
      @keyframes logoFloat {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        25% {
          transform: translateY(-4px) rotate(-1deg);
        }
        50% {
          transform: translateY(-6px) rotate(0deg);
        }
        75% {
          transform: translateY(-4px) rotate(1deg);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * SECTION: Apply animation to logos
   * Only apply to logos NOT in header (headers have their own styling)
   */
  const logos = document.querySelectorAll('a[href="index.html"]');
  logos.forEach(logo => {
    const header = logo.closest('header');
    if (!header) {
      if (!logo.classList.contains('logo-floating')) {
        logo.classList.add('logo-floating');
      }
    }
  });
  
  /**
   * SECTION: Apply animation to buttons
   * Excludes header buttons, profile menu items, and special UI elements
   */
  const allButtons = document.querySelectorAll('button, a[role="button"]');
  allButtons.forEach(button => {
    // Skip if in header - header has fixed styling
    if (button.closest('header')) return;
    
    // Skip if in profile modal/menu - these have custom styling
    if (button.closest('#profileModal')) return;
    
    // Skip profile avatar button - uses special styling
    if (button.id === 'profileAvatar' || button.closest('#profileAvatar')) return;
    
    // Skip theme toggle - positioned in header
    if (button.id === 'themeToggle') return;
    
    // Skip auth buttons (Get Started/Login) - positioned in header
    if (button.closest('#authButtons')) return;
    
    // Skip info dropdown button - custom styling in profile menu
    if (button.id === 'infoDropdownButton') return;
    
    // Add floating class if not already added
    if (!button.classList.contains('floating-hover')) {
      button.classList.add('floating-hover');
    }
  });
  
  // Apply to links that look like buttons (excluding header and profile menu)
  const buttonLinks = document.querySelectorAll('a');
  buttonLinks.forEach(link => {
    // Skip if in header
    if (link.closest('header')) return;
    
    // Skip if in profile modal
    if (link.closest('#profileModal')) return;
    
    // Skip if it's dashboard link in header
    if (link.id === 'dashboardLink') return;
    
    // Skip if it's logo in header
    if (link.href && link.href.includes('index.html') && link.closest('header')) return;
    
    // Only apply to links that look like buttons or are interactive
    const hasButtonClass = link.className && (
      link.className.includes('btn') || 
      link.className.includes('button') ||
      link.className.includes('cursor-pointer')
    );
    
    // Or if it's a significant action link
    const isActionLink = link.href && (
      link.href.includes('signup') || 
      link.href.includes('signin') ||
      (link.href.includes('profile') && !link.closest('header'))
    );
    
    if (hasButtonClass || isActionLink) {
      if (!link.classList.contains('floating-hover')) {
        link.classList.add('floating-hover');
      }
    }
  });
}

// Add floating animation on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Add floating animation after a short delay to ensure all elements are loaded
  setTimeout(addFloatingAnimation, 100);
  setTimeout(addFloatingAnimation, 500);
});

// Theme Toggle Functionality with Full UI Adaptation
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  // Initialize theme from localStorage or system preference
  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to dark theme
    let isDark = savedTheme ? savedTheme === 'dark' : true;
    
    applyTheme(isDark);
  }

  // Apply theme to document with full UI adaptation
  function applyTheme(isDark) {
    // FIRST: Set the class to ensure CSS rules apply
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // SECOND: Set theme metadata
    html.style.colorScheme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // THIRD: Update icon
    if (themeIcon) {
      themeIcon.textContent = isDark ? '☀️' : '🌙';
    }
    
    // FOURTH: Reset all element styles to allow CSS rules to apply
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      document.querySelectorAll('*').forEach(el => {
        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
        el.style.removeProperty('background-color');
        el.style.removeProperty('color');
        el.style.removeProperty('border-color');
        el.style.removeProperty('background-image');
        el.style.removeProperty('box-shadow');
        el.style.removeProperty('text-shadow');
      });
      
      // FIFTH: Update body styles
      document.body.style.backgroundColor = isDark ? '#0a0a0a' : '#ffffff';
      document.body.style.color = isDark ? '#ffffff' : '#1a1a1a';
      
      // FINALLY: Apply additional styles for light mode only
      if (!isDark) {
        // Use setTimeout to ensure styles are reset first
        setTimeout(() => {
          updateAllElements(false);
        }, 10);
      }
    });
  }
  
  // Make applyTheme globally available
  window.applyTheme = applyTheme;

  // Update all UI elements based on theme
  function updateAllElements(isDark) {
    if (isDark) return; // Skip if dark mode - CSS handles it
    
    // Light mode: aggressive update of all elements
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(el => {
      // Skip script and style tags
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
      
      // === FIX INPUT PLACEHOLDERS ===
      if (el.tagName === 'INPUT') {
        el.style.color = '#1a1a1a !important';
      }
      
      // Get computed styles
      const computed = window.getComputedStyle(el);
      const textColor = computed.color;
      const bgColor = computed.backgroundColor;
      
      // === FIX TEXT COLORS ===
      // White text → black
      if (textColor === 'rgb(255, 255, 255)' || 
          textColor === 'rgb(160, 160, 160)' ||
          textColor === 'rgba(255, 255, 255, 0.8)') {
        el.style.color = '#1a1a1a !important';
      }
      
      // Green text → dark green
      if (textColor === 'rgb(167, 198, 159)' || // #a7c69f
          el.style.color === '#a7c69f' || 
          el.style.color === '#A7C69F' ||
          el.className && (el.className.includes('text-custom-accent') || 
                          el.className.includes('text-[#A7C69F]') ||
                          el.className.includes('text-primary'))) {
        el.style.color = '#5a7a4f !important';
      }
      
      // Primary blue → dark
      if (el.className && el.className.includes('text-primary')) {
        el.style.color = '#5a7a4f !important';
      }
      
      // === FIX BACKGROUNDS ===
      // Dark backgrounds → white/light
      if (bgColor === 'rgb(10, 10, 10)' || 
          bgColor === 'rgb(17, 17, 17)' || 
          bgColor === 'rgb(26, 26, 26)' ||
          bgColor === 'rgb(51, 51, 51)' || 
          bgColor === 'rgba(0, 0, 0, 0)' ||
          bgColor === 'rgba(51, 51, 51, 0.2)' ||
          bgColor === 'rgba(51, 51, 51, 0.3)' ||
          bgColor === 'rgba(51, 51, 51, 0.5)' ||
          el.className && (el.className.includes('bg-custom-bg') ||
                          el.className.includes('bg-[#333333]') ||
                          el.className.includes('bg-[#0a0a0a]'))) {
        el.style.backgroundColor = '#ffffff !important';
      }
      
      // === FIX GRADIENTS AND COMPLEX BACKGROUNDS ===
      const style = el.getAttribute('style') || '';
      if (style.includes('background-image') || style.includes('background:')) {
        let newStyle = style;
        
        // Replace dark colors in gradients
        newStyle = newStyle.replace(/rgba\(51,\s*51,\s*51,\s*0\.\d+\)/g, 'rgba(245, 245, 245, 0.9)');
        newStyle = newStyle.replace(/rgba\(51,\s*51,\s*51/g, 'rgba(245, 245, 245');
        newStyle = newStyle.replace(/rgba\(26,\s*26,\s*26/g, 'rgba(255, 255, 255');
        newStyle = newStyle.replace(/rgba\(0,\s*0,\s*0,\s*0\.\d+\)/g, 'rgba(255, 255, 255, 0.9)');
        newStyle = newStyle.replace(/#333333/gi, '#ffffff');
        newStyle = newStyle.replace(/#0a0a0a/gi, '#ffffff');
        newStyle = newStyle.replace(/#111(?![a-fA-F0-9])/gi, '#ffffff');
        
        if (newStyle !== style) {
          el.setAttribute('style', newStyle);
        }
      }
      
      // === FIX BORDERS ===
      const borderColor = computed.borderColor;
      if (borderColor === 'rgb(51, 51, 51)' || 
          borderColor === 'rgba(0, 0, 0, 0)' ||
          borderColor === 'rgb(0, 0, 0)') {
        el.style.borderColor = '#e0e0e0 !important';
      }
      
      // Custom accent borders
      if (el.className && el.className.includes('border-custom-accent')) {
        el.style.borderColor = '#e0e0e0 !important';
      }
      
      // === FIX SVG ELEMENTS ===
      if (el.tagName === 'SVG') {
        el.style.color = '#1a1a1a !important';
      }
      if (el.tagName === 'path' || el.tagName === 'circle') {
        if (el.getAttribute('fill') === 'currentColor') {
          el.parentElement.style.color = '#1a1a1a !important';
        }
      }
      
      // === FIX BUTTONS ===
      if (el.tagName === 'BUTTON' || el.tagName === 'A') {
        const btnComputed = window.getComputedStyle(el);
        if (btnComputed.backgroundColor === 'rgb(51, 51, 51)' ||
            btnComputed.backgroundColor === 'rgb(10, 10, 10)') {
          el.style.backgroundColor = '#f5f5f5 !important';
          el.style.color = '#1a1a1a !important';
        }
      }
    });
  }

  // Toggle theme on button click
  if (themeToggle) {
    // Remove any existing attribute to ensure clean state
    themeToggle.removeAttribute('data-theme-handler-attached');
    
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const isDark = html.classList.contains('dark');
      applyTheme(!isDark);
    });
    
    // Mark as attached
    themeToggle.setAttribute('data-theme-handler-attached', 'true');
  }

  // Initialize on page load
  initializeTheme();
  
  // Initialize user status on all pages
  checkUserStatus();
  
});

/**
 * FUNCTION: toggleProfileMenu(e)
 * PURPOSE: Opens/closes the profile dropdown menu
 * 
 * TRIGGERED BY:
 * - Clicking profile avatar button
 * - Called from profile dropdown toggle
 * 
 * ACTIONS:
 * 1. Prevents event propagation (stops bubbling to document)
 * 2. Retrieves current user info (username, email, plan)
 * 3. Gets plan prefix badge if user has a plan
 * 4. Updates profile modal with user details
 * 5. Toggles visibility of profile modal (hidden/shown)
 * 
 * @param {Event} e - Click event (optional, may be undefined if called programmatically)
 */
// Common profile menu functionality for all pages
function toggleProfileMenu(e) {
  if (e) e.stopPropagation();
  const profileModal = document.getElementById('profileModal');
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  
  if (!profileModal) {
    console.error('Profile modal not found');
    return;
  }
  
  // SECTION: Update profile information display
  const profileUsername = document.getElementById('profileUsername');
  const profileEmail = document.getElementById('profileEmail');
  
  // Get user's current plan and create badge
  const userPlan = localStorage.getItem('userPlan');
  const planPrefix = getPlanPrefix(userPlan);
  
  if (profileUsername) {
    if (planPrefix) {
      // Show username with plan badge
      profileUsername.innerHTML = (username || 'User') + ' ' + planPrefix;
    } else {
      // Show username only if no plan
      profileUsername.textContent = username || 'User';
    }
  }
  if (profileEmail) profileEmail.textContent = email || 'email@example.com';
  
  // SECTION: Toggle profile modal visibility
  if (profileModal.classList.contains('hidden')) {
    profileModal.classList.remove('hidden');
  } else {
    profileModal.classList.add('hidden');
  }
}

// Make toggleProfileMenu globally accessible
window.toggleProfileMenu = toggleProfileMenu;

/**
 * FUNCTION: getPlanPrefix(planName)
 * PURPOSE: Creates a styled plan badge HTML for the profile menu
 * 
 * INPUT:
 * @param {string} planName - The user's plan type (basic, pro, enterprise, etc.)
 * 
 * RETURNS:
 * - Empty string if no plan name provided
 * - HTML button badge with plan name styled in green accent color
 * 
 * PLAN TYPES:
 * - 'basic' -> "Basic" (green badge)
 * - 'pro' -> "Pro" (green badge)
 * - 'enterprise' -> "Enterprise" (green badge)
 * - Any other value is returned as-is with green badge styling
 */
function getPlanPrefix(planName) {
  if (!planName) return '';
  const plan = planName.toLowerCase();
  const planNames = {
    'basic': 'Basic',
    'pro': 'Pro',
    'enterprise': 'Enterprise'
  };
  const planDisplayName = planNames[plan] || plan;
  return `<button class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#A7C69F] text-[#333333] border border-[#A7C69F] hover:bg-[#89b788] transition-colors">${planDisplayName}</button>`;
}

function closeProfileMenuOnBackdrop(event) {
  const profileModal = document.getElementById('profileModal');
  if (event.target === event.currentTarget && profileModal) {
    profileModal.classList.add('hidden');
  }
}

// ==== Custom Modal for confirmations ==== //
(function(){
  // Add styles for custom modal
  if (!document.getElementById('customModalStyles')) {
    const style = document.createElement('style');
    style.id = 'customModalStyles';
    style.textContent = `
      #customModal > div {
        background-color: #181818 !important;
        color: #ffffff !important;
      }
      html:not(.dark) #customModal > div {
        background-color: #ffffff !important;
        color: #1a1a1a !important;
        border-color: #5a7a4f !important;
      }
      #customModal #modalContent {
        color: #ffffff !important;
      }
      html:not(.dark) #customModal #modalContent {
        color: #1a1a1a !important;
      }
      #customModal #modalContent div {
        color: rgba(255, 255, 255, 0.9) !important;
      }
      html:not(.dark) #customModal #modalContent div {
        color: rgba(26, 26, 26, 0.9) !important;
      }
      #customModal #modalCloseBtn {
        color: rgba(255, 255, 255, 0.5) !important;
      }
      html:not(.dark) #customModal #modalCloseBtn {
        color: rgba(26, 26, 26, 0.5) !important;
      }
      #customModal #modalContent .text-white\\/80 {
        color: rgba(255, 255, 255, 0.95) !important;
      }
      html:not(.dark) #customModal #modalContent .text-white\\/80 {
        color: rgba(26, 26, 26, 0.9) !important;
      }
      #customModal #customModalError {
        color: #f87171 !important;
      }
      html:not(.dark) #customModal #customModalError {
        color: #dc2626 !important;
      }
      #customModal .text-red-400 {
        color: #f87171 !important;
      }
      html:not(.dark) #customModal .text-red-400 {
        color: #dc2626 !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  if (!document.getElementById('customModal')) {
    const modalHTML = `
      <div id="customModal" class="fixed z-50 inset-0 flex items-center justify-center bg-black/70 hidden">
        <div class="bg-[#181818] border border-[#A7C69F]/30 rounded-2xl shadow-2xl p-8 max-w-[94vw] w-full max-w-sm text-white relative" style="background-color: #181818 !important; color: #ffffff !important;">
          <button id="modalCloseBtn" class="absolute top-4 right-4 text-white/50 hover:text-[#A7C69F] focus:outline-none" style="color: rgba(255, 255, 255, 0.5) !important;"><span class="material-symbols-outlined">close</span></button>
          <div id="modalContent" class="space-y-6" style="color: #ffffff !important;"></div>
          <div class="flex gap-3 mt-6 items-center justify-end" id="modalActions"></div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add light theme styles to modal
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      html:not(.dark) #customModal > div {
        background-color: #ffffff !important;
        border-color: rgba(90, 122, 79, 0.3) !important;
      }
      html:not(.dark) #customModal {
        background-color: rgba(0, 0, 0, 0.5) !important;
      }
      html:not(.dark) #modalContent {
        color: #1a1a1a !important;
      }
      html:not(.dark) #modalContent .text-\[#A7C69F\] {
        color: #5a7a4f !important;
      }
      html:not(.dark) #modalContent .text-white\/80 {
        color: rgba(26, 26, 26, 0.9) !important;
      }
      html:not(.dark) #modalContent input {
        background-color: #f5f5f5 !important;
        color: #1a1a1a !important;
        border-color: rgba(90, 122, 79, 0.3) !important;
      }
      html:not(.dark) #modalContent input:focus {
        background-color: #ffffff !important;
        border-color: #5a7a4f !important;
      }
      html:not(.dark) #modalContent .text-white\/60 {
        color: rgba(26, 26, 26, 0.7) !important;
      }
      html:not(.dark) #modalContent .text-red-400 {
        color: #dc2626 !important;
      }
      html:not(.dark) #modalActions button.bg-\[#A7C69F\] {
        background-color: #5a7a4f !important;
        color: #ffffff !important;
      }
      html:not(.dark) #modalActions button.bg-\[#A7C69F\]:hover {
        background-color: #4a6a3f !important;
      }
      html:not(.dark) #modalActions button.border-\[#A7C69F\] {
        border-color: #5a7a4f !important;
        color: #5a7a4f !important;
      }
      html:not(.dark) #modalCloseBtn {
        color: rgba(26, 26, 26, 0.5) !important;
      }
      html:not(.dark) #modalCloseBtn:hover {
        color: #5a7a4f !important;
      }
    `;
    document.head.appendChild(styleElement);
  }
  const modal = document.getElementById('customModal');
  const modalContent = document.getElementById('modalContent');
  const modalActions = document.getElementById('modalActions');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  function closeModal() {
    modal.classList.add('hidden');
    modalContent.innerHTML = '';
    modalActions.innerHTML = '';
  }
  modal.addEventListener('mousedown', (e) => { if(e.target===modal) closeModal(); });
  modalCloseBtn.onclick = closeModal;
  document.addEventListener('keydown', (e) => { if(!modal.classList.contains('hidden') && e.key==='Escape') closeModal(); });

  window.showCustomModal = function({type = 'confirm', title = '', message = '', inputLabel = '', initialValue = '', confirmText = 'OK', cancelText = 'Cancel', onConfirm, onCancel, validate}) {
    modalContent.innerHTML = '';
    modalActions.innerHTML = '';
    if (title) modalContent.innerHTML += `<div class='text-xl font-bold text-[#A7C69F] mb-2' style='color: #A7C69F !important;'>${title}</div>`;
    if (message) {
      const isDark = document.documentElement.classList.contains('dark');
      const messageColor = isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(26, 26, 26, 0.9)';
      modalContent.innerHTML += `<div class='text-white/80' style='color: ${messageColor} !important;'>${message}</div>`;
    }
    
    // Buttons - create early so they're available for event handlers
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'rounded bg-[#A7C69F] text-[#232323] font-bold px-5 py-2 hover:bg-[#89b788] transition-colors';
    confirmBtn.textContent = confirmText;
    
    // Only add cancel button if cancelText is provided and not empty
    if (cancelText && cancelText.trim() !== '') {
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'rounded border border-[#A7C69F] text-[#A7C69F] px-5 py-2 hover:bg-[#232323]/60 hover:text-[#e5ffe8] transition-colors';
      cancelBtn.textContent = cancelText;
      modalActions.appendChild(cancelBtn);
    }
    
    modalActions.appendChild(confirmBtn);
    
    if (type === 'input') {
      modalContent.innerHTML += `
        <label class='block mt-4'>
          <span class='text-white/60' style='color: rgba(255, 255, 255, 0.6);'>${inputLabel || ''}</span>
          <input id='customModalInput' class='w-full mt-2 rounded bg-[#232323] border border-[#A7C69F]/30 p-2 text-base text-white outline-none focus:border-[#A7C69F]' type='text' autocomplete='off' value='${initialValue||''}' />
        </label>
        <span id='customModalError' class='text-red-400 block text-sm mt-1'></span>
      `;
      setTimeout(()=>{
        const inputEl = document.getElementById('customModalInput');
        if (inputEl) {
          inputEl.focus();
          inputEl.select();
          // Add Enter key handler to trigger Save button
          inputEl.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
              e.preventDefault();
              confirmBtn.click();
            }
          });
        }
      }, 90);
    }
    
    confirmBtn.onclick = ()=>{
      if(type==='input') {
        const inputEl = document.getElementById('customModalInput');
        if (!inputEl) return;
        const val = inputEl.value || '';
        const errorEl = document.getElementById('customModalError');
        
        if(validate && typeof validate === 'function') {
          try {
            const errorMsg = validate(val);
            // If validate returns a non-empty string, it's an error
            if(errorMsg && typeof errorMsg === 'string' && errorMsg.trim().length > 0) {
              if(errorEl) {
                errorEl.textContent = errorMsg;
                // Update error color based on theme
                const isDark = document.documentElement.classList.contains('dark');
                errorEl.style.color = isDark ? '#f87171' : '#dc2626';
              }
              return;
            }
          } catch(e) {
            console.error('Validation error:', e);
            if(errorEl) {
              errorEl.textContent = 'Validation error occurred';
              // Update error color based on theme
              const isDark = document.documentElement.classList.contains('dark');
              errorEl.style.color = isDark ? '#f87171' : '#dc2626';
            }
            return;
          }
        }
        // Clear error if validation passes
        if(errorEl) errorEl.textContent = '';
        closeModal();
        if (onConfirm) onConfirm(val.trim());
        return;
      }
      closeModal();
      if (onConfirm) onConfirm();
    };
    
    // Only set cancel button handler if cancel button exists
    const cancelBtnElement = modalActions.querySelector('button:not(:last-child)');
    if (cancelBtnElement) {
      cancelBtnElement.onclick = ()=>{ closeModal(); if(onCancel) onCancel(); };
    }
    
    modal.classList.remove('hidden');
  }
})();

// ==== END Custom Modal ====

/**
 * FUNCTION: handleLogout()
 * PURPOSE: Handles user logout process with confirmation
 * 
 * WORKFLOW:
 * 1. Shows confirmation modal asking if user really wants to logout
 * 2. On confirmation:
 *    - Removes all user data from localStorage (userId, username, email, etc.)
 *    - Closes profile modal if open
 *    - Updates UI by calling checkUserStatus()
 *    - Redirects to home page
 * 
 * CLEARS:
 * - userId (unique user identifier)
 * - username (display name)
 * - email (user email address)
 * - userAvatar (profile picture)
 * - userPlan (active financial plan)
 * - planPurchaseDate (when plan was purchased)
 */
function handleLogout() {
  window.showCustomModal({
    type: 'confirm',
    title: 'Log Out',
    message: 'Are you sure you want to log out?',
    confirmText: 'Log Out',
    cancelText: 'Cancel',
    onConfirm: function() {
      // SECTION: Clear all user data from localStorage
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('userAvatar');
      localStorage.removeItem('userPlan');
      localStorage.removeItem('planPurchaseDate');
      
      // Close profile modal if it's open
      const profileModal = document.getElementById('profileModal');
      if (profileModal) profileModal.classList.add('hidden');
      
      // Update UI and redirect after short delay to allow UI updates
      setTimeout(function() {
        checkUserStatus(); // Updates navbar based on auth status
        window.location.href = 'index.html';
      }, 100);
    }
  });
}

/**
 * FUNCTION: handleDeleteAccount()
 * PURPOSE: Handles permanent account deletion with strong confirmation
 * 
 * WORKFLOW:
 * 1. Shows warning modal with red text (cannot be undone)
 * 2. On confirmation:
 *    - Finds user in aiwallet_users array
 *    - Removes user from database
 *    - Clears all user localStorage data
 *    - Closes profile modal
 *    - Redirects to home page
 * 
 * WARNING: This action is permanent and cannot be recovered
 * User data deleted:
 * - User account from aiwallet_users database
 * - All localStorage user data (same as logout)
 * 
 * NOTE: For production, should also delete:
 * - All user's financial plans
 * - All user's shared plans
 * - All user's purchase history
 */
function handleDeleteAccount() {
  window.showCustomModal({
    type: 'confirm',
    title:'Delete Account',
    message: '<span style="color:#ef4444">This action cannot be undone!<br>Are you sure you want to delete your account?</span>',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: function() {
      // Get current user's ID
      const userId = localStorage.getItem('userId');
      
      // SECTION: Remove user from database
      let users = JSON.parse(localStorage.getItem('aiwallet_users')||'[]');
      // Filter out the user being deleted
      users = users.filter(u => u.id !== userId);
      // Save updated user list back to localStorage
      localStorage.setItem('aiwallet_users', JSON.stringify(users));
      
      // SECTION: Clear user data from localStorage (same as logout)
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('userAvatar');
      
      // Close profile modal if open
      const profileModal = document.getElementById('profileModal');
      if (profileModal) profileModal.classList.add('hidden');
      
      // Update UI and redirect after delay
      setTimeout(function() {
        checkUserStatus(); // Updates navbar based on new auth status
        window.location.href = 'index.html';
      }, 100);
    }
  });
}

/**
 * FUNCTION: setProfileAvatarMenuHandler()
 * PURPOSE: Attaches click event handler to profile avatar button
 * Manages profile dropdown menu toggle
 * 
 * FUNCTIONALITY:
 * - Removes old event listeners to prevent duplicates
 * - Attaches new click listener to profile avatar
 * - Handles both img and span child elements
 * - Prevents event bubbling to allow modal click-outside close
 */
function setProfileAvatarMenuHandler() {
  const profileAvatar = document.getElementById('profileAvatar');
  if (!profileAvatar) return;
  
  // SECTION: Clean up old event listeners to prevent duplicates
  profileAvatar.onclick = null;
  profileAvatar.removeEventListener('click', toggleProfileMenu);
  
  // Remove old handlers from img/span elements
  const newAvatarImg = profileAvatar.querySelector('img');
  const avatarSpan = profileAvatar.querySelector('span');
  if (newAvatarImg) newAvatarImg.removeEventListener('click', toggleProfileMenu);
  if (avatarSpan) avatarSpan.removeEventListener('click', toggleProfileMenu);
  // Add
  profileAvatar.addEventListener('click', toggleProfileMenu);
  if (newAvatarImg) newAvatarImg.addEventListener('click', toggleProfileMenu);
  if (avatarSpan) avatarSpan.addEventListener('click', toggleProfileMenu);
}

function checkUserStatus() {
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const authButtons = document.getElementById('authButtons');
  const profileAvatar = document.getElementById('profileAvatar');
  const avatarInitial = document.getElementById('avatarInitial');
  const dashboardLink = document.getElementById('dashboardLink');
  const createPlanLink = document.getElementById('createPlanLink');
  const myPlansLink = document.getElementById('myPlansLink');
  const sharePlanLink = document.getElementById('sharePlanLink');

  if (userId && username) {
    if (authButtons) authButtons.classList.add('hidden');
    if (dashboardLink) dashboardLink.classList.remove('hidden');
    if (createPlanLink) createPlanLink.classList.remove('hidden');
    if (myPlansLink) myPlansLink.classList.remove('hidden');
    if (sharePlanLink) sharePlanLink.classList.remove('hidden');
    if (profileAvatar) {
      profileAvatar.classList.remove('hidden');
      // Update avatar image if exists
      const userAvatar = localStorage.getItem('userAvatar');
      if (userAvatar) {
        profileAvatar.innerHTML = '';
        const img = document.createElement('img');
        img.src = userAvatar;
        img.className = 'w-full h-full rounded-lg object-cover';
        img.style.cursor = 'pointer';
        profileAvatar.appendChild(img);
      } else {
        if (avatarInitial) avatarInitial.textContent = username.charAt(0).toUpperCase();
        // Вставить обратно span если нет
        if (!profileAvatar.querySelector('span')) {
          const span = document.createElement('span');
          span.id = 'avatarInitial';
          span.textContent = username.charAt(0).toUpperCase();
          profileAvatar.appendChild(span);
        }
      }
      setProfileAvatarMenuHandler();
    }
    updateAuthButtons();
  } else {
    if (authButtons) authButtons.classList.remove('hidden');
    if (dashboardLink) dashboardLink.classList.add('hidden');
    if (createPlanLink) createPlanLink.classList.add('hidden');
    if (myPlansLink) myPlansLink.classList.add('hidden');
    if (sharePlanLink) sharePlanLink.classList.add('hidden');
    if (profileAvatar) profileAvatar.classList.add('hidden');
    resetAuthButtons();
  }
  syncHeaderLinks();
}

// Update all authentication buttons to point to profile if user is logged in
function updateAuthButtons() {
  // Get Started buttons
  const getStartedButtons = document.querySelectorAll('a[href="signup.html"]');
  getStartedButtons.forEach(btn => {
    if (!btn.id || btn.id !== 'getStartedBtn') {
      btn.href = 'profile.html';
    }
  });
  
  // Activate Your AI buttons
  const activateButtons = document.querySelectorAll('a[href*="signup"], a[id*="activate"]');
  activateButtons.forEach(btn => {
    if (btn.textContent.includes('Activate') || btn.id === 'activateBtn') {
      btn.href = 'profile.html';
    }
  });
  
  // Login buttons
  const loginButtons = document.querySelectorAll('a[href="signin.html"]');
  loginButtons.forEach(btn => {
    btn.href = 'profile.html';
  });
}

// Reset all authentication buttons to point to signup/signin
function resetAuthButtons() {
  const getStartedButtons = document.querySelectorAll('a[href="profile.html"]');
  getStartedButtons.forEach(btn => {
    // Only reset if it's not a profile link or other navigation
    if (btn.textContent.includes('Get Started') || btn.textContent.includes('Activate')) {
      btn.href = 'signup.html';
    }
  });
  
  const loginButtons = document.querySelectorAll('a[href="profile.html"]');
  loginButtons.forEach(btn => {
    if (btn.textContent.includes('Login') || btn.textContent.includes('Login')) {
      btn.href = 'signin.html';
    }
  });
}

/**
 * NAVBAR SYNCHRONIZATION FUNCTION
 * Manages visibility of navbar links based on authentication status
 * Shows different menu options for logged-in vs logged-out users
 * Also manages "Add Purchase" button visibility (only for logged-in users)
 */
function syncHeaderLinks() {
  // Check if user is currently logged in
  const isLoggedIn = !!(localStorage.getItem('userId') && localStorage.getItem('username'));
  
  // Get references to UI elements in header
  const infoDropdownButton = document.getElementById('infoDropdownButton');
  const infoDropdownMenu = document.getElementById('infoDropdownMenu');
  const dashboardLink = document.getElementById('dashboardLink');
  const createPlanLink = document.getElementById('createPlanLink');
  const myPlansLink = document.getElementById('myPlansLink');
  const sharePlanLink = document.getElementById('sharePlanLink');
  const addPurchaseLink = document.getElementById('addPurchaseLink');
  const headerLinksBlock = Array.from(document.querySelectorAll('header .flex.items-center.gap-9'))[0];
  
  // SECTION: Manage individual header link visibility
  // These links should only show when user is logged in
  if (dashboardLink) {
    if (isLoggedIn) {
      dashboardLink.classList.remove('hidden');
    } else {
      dashboardLink.classList.add('hidden');
    }
  }
  
  if (createPlanLink) {
    if (isLoggedIn) {
      createPlanLink.classList.remove('hidden');
    } else {
      createPlanLink.classList.add('hidden');
    }
  }
  
  if (myPlansLink) {
    if (isLoggedIn) {
      myPlansLink.classList.remove('hidden');
    } else {
      myPlansLink.classList.add('hidden');
    }
  }
  
  if (sharePlanLink) {
    if (isLoggedIn) {
      sharePlanLink.classList.remove('hidden');
    } else {
      sharePlanLink.classList.add('hidden');
    }
  }
  
  /**
   * NEW: Add Purchase button visibility
   * Shows "Add Purchase" button when user is logged in
   * This is the main button for recording daily expenses
   */
  if (addPurchaseLink) {
    if (isLoggedIn) {
      addPurchaseLink.classList.remove('hidden');
    } else {
      addPurchaseLink.classList.add('hidden');
    }
  }
  
  // Exit early if header links block not found
  if (!headerLinksBlock) return;
  
  if (isLoggedIn) {
    // SECTION: Logged-in user navbar
    // Show: Dashboard, Create Plan, My Plans, Share Plan, Add Purchase, Pricing
    Array.from(headerLinksBlock.children).forEach(child=>{
      const text = child.textContent || '';
      const href = child.getAttribute('href') || '';
      const isSharePlan = child.id === 'sharePlanLink' || href.includes('share-plans.html');
      const isAddPurchase = child.id === 'addPurchaseLink' || href.includes('addpurchase.html');
      
      // Determine if this link should be visible for logged-in users
      const shouldShow = text.includes('Pricing') || 
                        text.includes('Dashboard') || 
                        text.includes('Create Plan') || 
                        text.includes('My Plans') || 
                        isSharePlan || 
                        isAddPurchase;
      
      child.style.display = shouldShow ? '' : 'none';
      if (shouldShow) {
        child.classList.remove('hidden');
      } else {
        child.classList.add('hidden');
      }
    });
    
    // Show user info dropdown when logged in
    if (infoDropdownButton) infoDropdownButton.style.display = '';
    if (infoDropdownMenu) infoDropdownMenu.classList.add('hidden');
  } else {
    // SECTION: Logged-out user navbar
    // Show only: Overview, Features, Resources, Pricing (no Share Plan, no Add Purchase)
    Array.from(headerLinksBlock.children).forEach(child => {
      const href = child.getAttribute('href') || '';
      const text = child.textContent || '';
      const isSharePlan = child.id === 'sharePlanLink' || href.includes('share-plans.html');
      const isAddPurchase = child.id === 'addPurchaseLink' || href.includes('addpurchase.html');
      const isDashboard = child.id === 'dashboardLink' || href.includes('profile.html');
      const isCreatePlan = child.id === 'createPlanLink' || href.includes('createplan.html');
      const isMyPlans = child.id === 'myPlansLink' || href.includes('myplans.html');
      
      // Hide authenticated-only links for non-logged-in users
      if (isSharePlan || isAddPurchase || isDashboard || isCreatePlan || isMyPlans) {
        child.style.display = 'none';
        child.classList.add('hidden');
        return;
      }
      
      // Show public pages only
      const shouldShow = href.includes('overview.html') || 
                        href.includes('features.html') || 
                        href.includes('resources.html') || 
                        href.includes('pricing.html');
      
      if (shouldShow) {
        child.style.display = '';
        child.classList.remove('hidden');
      } else {
        child.style.display = 'none';
        child.classList.add('hidden');
      }
    });
    
    // Hide user info dropdown when not logged in
    if (infoDropdownButton) infoDropdownButton.style.display = 'none';
    if (infoDropdownMenu) infoDropdownMenu.classList.add('hidden');
  }
}

// Close modal when clicking outside (for all pages)
document.addEventListener('click', function(e) {
  const profileModal = document.getElementById('profileModal');
  const profileAvatar = document.getElementById('profileAvatar');
  const infoDropdownButton = document.getElementById('infoDropdownButton');
  const infoDropdownMenu = document.getElementById('infoDropdownMenu');
  
  if (profileModal && !profileModal.classList.contains('hidden')) {
    // Check if click is on a button or link inside the modal
    const clickedButton = e.target.closest('button, a');
    const isInsideModal = profileModal.contains(e.target);
    const isOnAvatar = profileAvatar && profileAvatar.contains(e.target);
    const isOnInfoButton = infoDropdownButton && infoDropdownButton.contains(e.target);
    const isOnInfoMenu = infoDropdownMenu && infoDropdownMenu.contains(e.target);
    
    // Close Info dropdown if clicking outside of it (but not on the button)
    if (infoDropdownMenu && !infoDropdownMenu.classList.contains('hidden')) {
      if (!isOnInfoButton && !isOnInfoMenu) {
        infoDropdownMenu.classList.add('hidden');
        const infoDropdownArrow = document.getElementById('infoDropdownArrow');
        if (infoDropdownArrow) {
          infoDropdownArrow.style.transform = 'rotate(0deg)';
        }
      }
    }
    
    // Close only if clicking outside the modal and not on the avatar
    // But don't close if clicking on buttons/links inside the modal
    if (!isInsideModal && !isOnAvatar) {
      profileModal.classList.add('hidden');
      // Also close Info dropdown if modal is closing
      if (infoDropdownMenu && !infoDropdownMenu.classList.contains('hidden')) {
        infoDropdownMenu.classList.add('hidden');
        const infoDropdownArrow = document.getElementById('infoDropdownArrow');
        if (infoDropdownArrow) {
          infoDropdownArrow.style.transform = 'rotate(0deg)';
        }
      }
    } else if (isInsideModal && clickedButton) {
      // If clicking on a button/link inside modal, let it handle its own action
      // The modal will close naturally when navigating or after action completes
    }
  }
});

// Toggle Info dropdown menu
function toggleInfoDropdown() {
  const infoDropdownButton = document.getElementById('infoDropdownButton');
  const infoDropdownMenu = document.getElementById('infoDropdownMenu');
  const infoDropdownArrow = document.getElementById('infoDropdownArrow');
  
  if (!infoDropdownButton || !infoDropdownMenu) return;
  
  const isHidden = infoDropdownMenu.classList.contains('hidden');
  
  if (isHidden) {
    infoDropdownMenu.classList.remove('hidden');
    // Ensure flex display is applied (flex-col class should handle this, but ensure it)
    if (!infoDropdownMenu.classList.contains('flex')) {
      infoDropdownMenu.classList.add('flex');
    }
    if (infoDropdownArrow) {
      infoDropdownArrow.style.transform = 'rotate(180deg)';
    }
  } else {
    infoDropdownMenu.classList.add('hidden');
    if (infoDropdownArrow) {
      infoDropdownArrow.style.transform = 'rotate(0deg)';
    }
  }
}

// Make toggleInfoDropdown globally accessible
window.toggleInfoDropdown = toggleInfoDropdown;

// Add click handler for Info dropdown button using event delegation
// This ensures it works even if the button is created dynamically
// Use event delegation on document to catch clicks on Info button
document.addEventListener('click', function(e) {
  // Check if click is on the Info button or any element inside it
  const clickedElement = e.target;
  const infoDropdownButton = document.getElementById('infoDropdownButton');
  
  if (!infoDropdownButton) return;
  
  // Check if click is on the button itself or any child element
  if (infoDropdownButton.contains(clickedElement) || infoDropdownButton === clickedElement) {
    // Check if click is on a link inside the dropdown menu (should not toggle)
    const infoDropdownMenu = document.getElementById('infoDropdownMenu');
    if (infoDropdownMenu && infoDropdownMenu.contains(clickedElement)) {
      return; // Don't toggle if clicking on menu links
    }
    
    e.stopPropagation();
    toggleInfoDropdown();
    return;
  }
});

// Update avatar from localStorage on load (for all pages)
window.addEventListener('load', function() {
  checkUserStatus();
  
  
  // Ensure all profile avatars have click handlers
  const profileAvatars = document.querySelectorAll('#profileAvatar');
  profileAvatars.forEach(avatar => {
    if (!avatar.hasAttribute('data-listener-attached')) {
      avatar.addEventListener('click', toggleProfileMenu);
      avatar.setAttribute('data-listener-attached', 'true');
    }
  });
  
  // Add direct click handler for Info dropdown button
  // This ensures it works on all pages
  function attachInfoButtonHandler() {
    const infoDropdownButton = document.getElementById('infoDropdownButton');
    if (infoDropdownButton && !infoDropdownButton.hasAttribute('data-info-handler-attached')) {
      infoDropdownButton.setAttribute('data-info-handler-attached', 'true');
      
      infoDropdownButton.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (typeof toggleInfoDropdown === 'function') {
          toggleInfoDropdown();
        }
      });
    }
  }
  
  // Attach handler immediately
  attachInfoButtonHandler();
  
  // Also try after a short delay in case button is created dynamically
  setTimeout(attachInfoButtonHandler, 100);
  setTimeout(attachInfoButtonHandler, 500);
  
  // Add floating animation to buttons and logo (excluding header, profile menu, and profile avatar)
  addFloatingAnimation();
});