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
  
  if (profileUsername) profileUsername.textContent = username || 'User';
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

function closeProfileMenuOnBackdrop(event) {
  const profileModal = document.getElementById('profileModal');
  if (event.target === event.currentTarget && profileModal) {
    profileModal.classList.add('hidden');
  }
}

// ==== Custom Modal for confirmations ==== //
(function(){
  if (!document.getElementById('customModal')) {
    const modalHTML = `
      <div id="customModal" class="fixed z-50 inset-0 flex items-center justify-center bg-black/70 hidden">
        <div class="bg-[#181818] border border-[#A7C69F]/30 rounded-2xl shadow-2xl p-8 max-w-[94vw] w-full max-w-sm text-white relative">
          <button id="modalCloseBtn" class="absolute top-4 right-4 text-white/50 hover:text-[#A7C69F] focus:outline-none"><span class="material-symbols-outlined">close</span></button>
          <div id="modalContent" class="space-y-6"></div>
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
    if (title) modalContent.innerHTML += `<div class='text-xl font-bold text-[#A7C69F] mb-2'>${title}</div>`;
    if (message) modalContent.innerHTML += `<div class='text-white/80'>${message}</div>`;
    if (type === 'input') {
      modalContent.innerHTML += `
        <label class='block mt-4'>
          <span class='text-white/60'>${inputLabel || ''}</span>
          <input id='customModalInput' class='w-full mt-2 rounded bg-[#232323] border border-[#A7C69F]/30 p-2 text-base text-white outline-none focus:border-[#A7C69F]' type='text' autocomplete='off' value='${initialValue||''}' />
        </label>
        <span id='customModalError' class='text-red-400 block text-sm mt-1'></span>
      `;
      setTimeout(()=>{
        document.getElementById('customModalInput').focus();
        document.getElementById('customModalInput').select();
      }, 90);
    }
    // Buttons
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'rounded bg-[#A7C69F] text-[#232323] font-bold px-5 py-2 hover:bg-[#89b788] transition-colors';
    confirmBtn.textContent = confirmText;
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'rounded border border-[#A7C69F] text-[#A7C69F] px-5 py-2 hover:bg-[#232323]/60 hover:text-[#e5ffe8] transition-colors';
    cancelBtn.textContent = cancelText;
    modalActions.appendChild(cancelBtn);
    modalActions.appendChild(confirmBtn);
    confirmBtn.onclick = ()=>{
      if(type==='input') {
        const val = document.getElementById('customModalInput').value.trim();
        if(validate && !validate(val)) {
          document.getElementById('customModalError').textContent = typeof validate==='function'? validate(val)||'Ошибка': 'Ошибка';
          return;
        }
        closeModal();
        if (onConfirm) onConfirm(val);
        return;
      }
      closeModal();
      if (onConfirm) onConfirm();
    };
    cancelBtn.onclick = ()=>{ closeModal(); if(onCancel) onCancel(); };
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
      const profileModal = document.getElementById('profileModal');
      if (profileModal) profileModal.classList.add('hidden');
      setTimeout(function() {
        checkUserStatus();
        window.location.href = 'main.html';
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
        window.location.href = 'main.html';
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

  if (userId && username) {
    if (authButtons) authButtons.classList.add('hidden');
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
    if (profileAvatar) profileAvatar.classList.add('hidden');
    resetAuthButtons();
  }
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

// Close modal when clicking outside (for all pages)
document.addEventListener('click', function(e) {
  const profileModal = document.getElementById('profileModal');
  const profileAvatar = document.getElementById('profileAvatar');
  
  if (profileModal && !profileModal.classList.contains('hidden')) {
    // Check if click is on a button or link inside the modal
    const clickedButton = e.target.closest('button, a');
    const isInsideModal = profileModal.contains(e.target);
    const isOnAvatar = profileAvatar && profileAvatar.contains(e.target);
    
    // Close only if clicking outside the modal and not on the avatar
    // But don't close if clicking on buttons/links inside the modal
    if (!isInsideModal && !isOnAvatar) {
      profileModal.classList.add('hidden');
    } else if (isInsideModal && clickedButton) {
      // If clicking on a button/link inside modal, let it handle its own action
      // The modal will close naturally when navigating or after action completes
    }
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
});