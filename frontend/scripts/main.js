// frontend/scripts/main.js
// Main JavaScript loader - using the original complete Script.js

// ⭐ ADDED: تأكيد إن الملف نفسه ينفّذ
console.log("[main.js] loaded");

// Import i18n module first
import './modules/i18n.js';

// Import the original complete Script.js file
import './Script.js';
import './auth-nav.js';

// Import dropdown functionality fix (temporarily disabled to test language switcher)
// import './dropdown-fix.js';


// =======================
// ⭐ NEW: Auth Navbar Management (Robust Version)
// =======================
function updateAuthNav() {
  const token = localStorage.getItem("auth_token");
  console.log("[main.js] updateAuthNav() called, token:", token); // ⭐ DEBUG

  const navLogin    = document.getElementById("nav-login");
  const navRegister = document.getElementById("nav-register");
  const navProfile  = document.getElementById("nav-profile");
  const navLogout   = document.getElementById("nav-logout");

  console.log("[main.js] nav items:", { navLogin, navRegister, navProfile, navLogout }); // ⭐ DEBUG

  // نتعامل مع كل عنصر لوحده، بدون خروج مبكر من الدالة
  if (token) {
    // ✅ مستخدم مسجّل دخول
    if (navLogin)    navLogin.style.display    = "none";
    if (navRegister) navRegister.style.display = "none";
    if (navProfile)  navProfile.style.display  = "block";
    if (navLogout)   navLogout.style.display   = "block";
  } else {
    // ✅ مستخدم غير مسجّل
    if (navLogin)    navLogin.style.display    = "block";
    if (navRegister) navRegister.style.display = "block";
    if (navProfile)  navProfile.style.display  = "none";
    if (navLogout)   navLogout.style.display   = "none";
  }
}

// ⭐ ADDED: نطلّعها على window عشان تقدر تستدعيها من الـ Console
window.updateAuthNav = updateAuthNav;


// =======================
// ⭐ NEW: initMainScripts يجمع auth + الأنيميشن
// =======================
function initMainScripts() {
  console.log("[main.js] initMainScripts()"); // ⭐ DEBUG

  // ✅ أول شيء نحدّث حالة الهيدر
  updateAuthNav();

  // ✅ ربط زر تسجيل الخروج
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("[main.js] Logout clicked"); // ⭐ DEBUG

      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");

      window.location.href = "/pages/index.html";
    });
  }

  // =======================
  // 🔁 الكود القديم حق الأنيميشن كما هو
  // =======================

  // Add page loading animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);

  // Enhanced scroll reveal animations
  const revealElements = document.querySelectorAll('.program-card, .program-header, .destination-card');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px) scale(0.9)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    revealObserver.observe(el);
  });

  // Add CSS for enhanced animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
    
    @keyframes ctaRipple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
    
    .destination-card {
      position: relative;
      overflow: hidden;
    }
    
    .cta-btn {
      position: relative;
      overflow: hidden;
    }
    
    /* Hide scroll indicator when scrolled */
    .scroll-indicator {
      transition: all 0.3s ease;
    }
    
    .scroll-indicator.hidden {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    
    /* Enhanced hero particles for better performance */
    .particle {
      will-change: transform;
      backface-visibility: hidden;
    }
    
    /* Smooth transitions for theme switching */
    * {
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
  `;
  document.head.appendChild(style);

  // Add active nav item styles
  const navStyle = document.createElement('style');
  navStyle.textContent = `
    .nav .item a.active {
      color: var(--saudi-green);
      background: rgba(0, 98, 51, 0.1);
      font-weight: 600;
    }
  `;
  document.head.appendChild(navStyle);
}


// =======================
// ⭐ استدعاءات لضمان التنفيذ
// =======================

// 1) لو الـ DOM جاهز
document.addEventListener("DOMContentLoaded", () => {
  console.log("[main.js] DOMContentLoaded"); // ⭐ DEBUG
  initMainScripts();
});

// 2) لو كل الصفحة/resources حملت
window.addEventListener("load", () => {
  console.log("[main.js] window.load"); // ⭐ DEBUG
  updateAuthNav();
});

// 3) محاولة فورية (في حال السكربت في نهاية الـ body)
updateAuthNav(); // ⭐ DEBUG: محاولة أولى
