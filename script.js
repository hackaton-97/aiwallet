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
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    
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
});