// Add floating animation to buttons and logo
function addFloatingAnimation() {
  // Add CSS for floating animation if not already added
  if (!document.getElementById('floatingAnimationStyle')) {
    const style = document.createElement('style');
    style.id = 'floatingAnimationStyle';
    style.textContent = `
      /* Floating animation for buttons and logo */
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
      
      /* Logo specific animation */
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
  
  // Apply to logo (only if not in header)
  const logos = document.querySelectorAll('a[href="index.html"]');
  logos.forEach(logo => {
    // Check if logo is NOT in header
    const header = logo.closest('header');
    if (!header) {
      if (!logo.classList.contains('logo-floating')) {
        logo.classList.add('logo-floating');
      }
    }
  });
  
  // Apply to all buttons (excluding header, profile menu, and profile avatar)
  const allButtons = document.querySelectorAll('button, a[role="button"]');
  allButtons.forEach(button => {
    // Skip if in header
    if (button.closest('header')) return;
    
    // Skip if in profile modal/menu
    if (button.closest('#profileModal')) return;
    
    // Skip profile avatar
    if (button.id === 'profileAvatar' || button.closest('#profileAvatar')) return;
    
    // Skip theme toggle (it's in header)
    if (button.id === 'themeToggle') return;
    
    // Skip auth buttons (they're in header)
    if (button.closest('#authButtons')) return;
    
    // Skip info dropdown button (it's in profile menu)
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
      updateAllElements(false);
    }
  }

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
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const isDark = html.classList.contains('dark');
      applyTheme(!isDark);
    });
  }

  // Initialize on page load
  initializeTheme();
  
  // Initialize user status on all pages
  checkUserStatus();
});

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
  
  // Update profile info
  const profileUsername = document.getElementById('profileUsername');
  const profileEmail = document.getElementById('profileEmail');
  
  // Get plan prefix
  const userPlan = localStorage.getItem('userPlan');
  const planPrefix = getPlanPrefix(userPlan);
  
  if (profileUsername) {
    if (planPrefix) {
      profileUsername.innerHTML = (username || 'User') + ' ' + planPrefix;
    } else {
      profileUsername.textContent = username || 'User';
    }
  }
  if (profileEmail) profileEmail.textContent = email || 'email@example.com';
  
  // Toggle modal
  if (profileModal.classList.contains('hidden')) {
    profileModal.classList.remove('hidden');
  } else {
    profileModal.classList.add('hidden');
  }
}

// Make toggleProfileMenu globally accessible
window.toggleProfileMenu = toggleProfileMenu;

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

function handleLogout() {
  window.showCustomModal({
    type: 'confirm',
    title: 'Log Out',
    message: 'Are you sure you want to log out?',
    confirmText: 'Log Out',
    cancelText: 'Cancel',
    onConfirm: function() {
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('userAvatar');
      localStorage.removeItem('userPlan');
      localStorage.removeItem('planPurchaseDate');
      const profileModal = document.getElementById('profileModal');
      if (profileModal) profileModal.classList.add('hidden');
      setTimeout(function() {
        checkUserStatus();
        window.location.href = 'index.html';
      }, 100);
    }
  });
}

function handleDeleteAccount() {
  window.showCustomModal({
    type: 'confirm',
    title:'Delete Account',
    message: '<span style="color:#ef4444">This action cannot be undone!<br>Are you sure you want to delete your account?</span>',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: function() {
      const userId = localStorage.getItem('userId');
      let users = JSON.parse(localStorage.getItem('aiwallet_users')||'[]');
      users = users.filter(u => u.id !== userId);
      localStorage.setItem('aiwallet_users', JSON.stringify(users));
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('userAvatar');
      const profileModal = document.getElementById('profileModal');
      if (profileModal) profileModal.classList.add('hidden');
      setTimeout(function() {
        checkUserStatus();
        window.location.href = 'index.html';
      }, 100);
    }
  });
}

function setProfileAvatarMenuHandler() {
  const profileAvatar = document.getElementById('profileAvatar');
  if (!profileAvatar) return;
  // Remove all previous listeners
  profileAvatar.onclick = null;
  profileAvatar.removeEventListener('click', toggleProfileMenu);
  // Remove old handlers for img/span
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

  if (userId && username) {
    if (authButtons) authButtons.classList.add('hidden');
    if (dashboardLink) dashboardLink.classList.remove('hidden');
    if (createPlanLink) createPlanLink.classList.remove('hidden');
    if (myPlansLink) myPlansLink.classList.remove('hidden');
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

function syncHeaderLinks() {
  const isLoggedIn = !!(localStorage.getItem('userId') && localStorage.getItem('username'));
  const infoDropdownButton = document.getElementById('infoDropdownButton');
  const infoDropdownMenu = document.getElementById('infoDropdownMenu');
  const dashboardLink = document.getElementById('dashboardLink');
  const createPlanLink = document.getElementById('createPlanLink');
  const myPlansLink = document.getElementById('myPlansLink');
  const headerLinksBlock = Array.from(document.querySelectorAll('header .flex.items-center.gap-9'))[0];
  
  // Show/hide Dashboard, Create Plan, and My Plans links based on login status
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
  
  // Если не нашли — не трогаем
  if (!headerLinksBlock) return;
  if (isLoggedIn) {
    // Показываем только Pricing, Create Plan, My Plans и Dashboard (они есть у всех)
    Array.from(headerLinksBlock.children).forEach(child=>{
      const text = child.textContent || '';
      child.style.display = (text.includes('Pricing') || text.includes('Dashboard') || text.includes('Create Plan') || text.includes('My Plans')) ? '' : 'none';
    });
    if (infoDropdownButton) infoDropdownButton.style.display = '';
    if (infoDropdownMenu) infoDropdownMenu.classList.add('hidden');
  } else {
    // Показывать Overview, Features, Resources (+ Pricing)
    headerLinksBlock.innerHTML = `
      <a class="text-white/80 text-sm font-medium leading-normal transition-colors hover:text-[#A7C69F] hover:drop-shadow-[0_0_8px_#A7C69F]" href="overview.html">Overview</a>
      <a class="text-white/80 text-sm font-medium leading-normal transition-colors hover:text-[#A7C69F] hover:drop-shadow-[0_0_8px_#A7C69F]" href="features.html">Features</a>
      <a class="text-white/80 text-sm font-medium leading-normal transition-colors hover:text-[#A7C69F] hover:drop-shadow-[0_0_8px_#A7C69F]" href="resources.html">Resources</a>
      <a class="text-white/80 text-sm font-medium leading-normal transition-colors hover:text-[#A7C69F] hover:drop-shadow-[0_0_8px_#A7C69F]" href="pricing.html">Pricing</a>
    `;
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