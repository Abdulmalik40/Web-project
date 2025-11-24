/**
 * Header Component - Reusable header for all pages
 * This script ensures a consistent header navigation across all pages
 * Uses the exact structure and styling from index.html
 *
 * 🆕 ملاحظة مهمة:
 * - أضفنا عناصر auth (login / register / profile / logout)
 *   بنفس IDs الموجودة في index.html:
 *   #nav-login, #nav-register, #nav-profile, #nav-logout, #logoutBtn
 *   حتى يشتغل معها ملف auth-nav.js في كل الصفحات
 */

(function () {
  'use strict';

  // Get current page path to adjust navigation links
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || '';
  const isIndexPage =
    currentPage === 'index.html' || currentPage === '' || currentPage.endsWith('/');
  
  // Determine if we're in a subfolder and get the path prefix
  // Find the 'pages' folder in the path and get everything after it
  const pagesIndex = currentPath.indexOf('/pages/');
  const pathAfterPages = pagesIndex >= 0 
    ? currentPath.substring(pagesIndex + '/pages/'.length)
    : currentPath;
  const pathParts = pathAfterPages.split('/').filter(p => p);
  const isInSubfolder = pathParts.length > 1; // More than just the filename
  const pathPrefix = isInSubfolder ? '../' : '';

  // Helper to get correct path for links داخل /pages/ أو من الصفحة الرئيسية
  function getLink(hash, file) {
    if (file) return file;                    // لو عطيناه ملف محدد استخدمه كما هو
    return isIndexPage ? `#${hash}` : `${pathPrefix}index.html#${hash}`; // غير كذا رجّعه للهوم مع الـ hash
  }
  
  // Helper to get correct path for files in other folders
  function getNavPath(folder, file) {
    // If we're in the same folder, no prefix needed
    const currentFolder = pathParts.length > 1 ? pathParts[pathParts.length - 2] : '';
    if (currentFolder === folder) {
      return file;
    }
    // Otherwise, use pathPrefix to go up and then into the folder
    return `${pathPrefix}${folder}/${file}`;
  }

  /**
   * 🧱 Standard header HTML
   * - مطابق لهيدر index.html بالضبط
   * - مع إضافة عناصر auth (login/register/profile/logout)
   * - يضيف class="site-header" للصفحة الرئيسية
   */
  function getHeaderHTML() {
    // Determine header class - add "site-header" for index page
    const headerClass = isIndexPage ? 'header site-header' : 'header';
    
    // For index page, use direct paths; for other pages, use pathPrefix
    const getIndexLink = (path) => isIndexPage ? path : `${pathPrefix}${path}`;
    const getIndexHash = (hash) => isIndexPage ? `#${hash}` : `${pathPrefix}index.html#${hash}`;
    
    return `
    <header class="${headerClass}" id="header">
      <div class="header-inner">
        <div class="brand" aria-label="Saudi Tourism">
          <div class="brand-mark" aria-hidden="true"></div>
          <div>
            <div
              class="brand-title"
              data-i18n="header.brandTitle"
            >
              Visit Saudi Arabia
            </div>
            <div class="brand-sub" data-i18n="header.brandSub">
              Explore regions, heritage, and faith
            </div>
          </div>
        </div>

        <div class="nav-container">
          <!-- Language toggle -->
          <button
            class="language-toggle"
            id="language-switcher"
            aria-label="Toggle language"
            title="Switch Language"
          >
            <span class="lang-icon">🌐</span>
            <span class="lang-text" data-i18n="common.language">
              Language
            </span>
          </button>

          <!-- Theme toggle -->
          <button
            class="theme-toggle"
            id="themeToggle"
            aria-label="Toggle theme"
          >
            <span class="theme-icon">🌙</span>
            <span class="theme-text" data-i18n="common.dark">
              Dark
            </span>
          </button>

          <!-- Main navigation -->
          <nav class="nav" aria-label="Main Navigation">
            <div class="item">
              <a href="${getIndexHash('home')}" data-i18n="common.home">Home</a>
            </div>
            <div class="item">
              <a
                href="${getIndexLink('maps/map-interactive.html')}"
                data-i18n="common.interactiveMap"
                >Interactive Map</a
              >
            </div>
            <div class="item">
              <a href="${getIndexLink('core/history.html')}" data-i18n="common.history">
                History
              </a>
            </div>
            <div class="item has-dropdown">
              <a
                href="${getIndexLink('islamic-guide/islamic-guide.html')}"
                data-i18n="common.islamicGuide"
                >Islamic Guide ▾</a
              >
              <div class="dropdown" role="menu">
                <a
                  href="${getIndexLink('islamic-guide/qibla.html')}"
                  role="menuitem"
                  data-i18n="common.qiblaFinder"
                  >Qibla Finder</a
                >
                <a
                  href="${getIndexLink('islamic-guide/prayer-times.html')}"
                  role="menuitem"
                  data-i18n="common.prayerTimes"
                  >Prayer Times</a
                >
                <a
                  href="${getIndexLink('islamic-guide/quran.html')}"
                  role="menuitem"
                  data-i18n="common.quran"
                  >Quran &amp; Du'a</a
                >
              </div>
            </div>

            <!-- Login / Register -->
            <div class="item" id="nav-login">
              <a href="${getIndexLink('auth/login.html')}" data-i18n="common.login">Login</a>
            </div>
            <div class="item" id="nav-register">
              <a href="${getIndexLink('auth/register.html')}" data-i18n="common.register">Register</a>
            </div>

            <!-- Profile & Logout (hidden by default) -->
            <div
              class="item"
              id="nav-profile"
              style="display: none;"
            >
              <a href="${getIndexLink('user/profile.html')}" data-i18n="common.profile">Profile</a>
            </div>
            <div
              class="item"
              id="nav-logout"
              style="display: none;"
            >
              <a href="#" id="logoutBtn" data-i18n="common.logout">Logout</a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  `;
  }

  /**
   * injectHeader
   * - لو عندنا <header id="header" data-header-placeholder> يستبدله بالهيدر الموحّد
   * - أو يضيف هيدر جديد في بداية الـ body لو مافيه هيدر
   * - بعدين يفعّل الثيم + السكول + القائمة المنسدلة + اللغة
   */
  function injectHeader() {
    const existingHeader = document.getElementById('header');
    const headerHTML = getHeaderHTML();

    // 🟢 الحالة 1: موجود header فيه data-header-placeholder → نستبدله بالكامل
    if (existingHeader && existingHeader.hasAttribute('data-header-placeholder')) {
      existingHeader.outerHTML = headerHTML;
    }
    // 🟡 الحالة 2: هيدر موجود بدون placeholder → نستبدله بالكامل (خاصة للصفحة الرئيسية)
    else if (existingHeader) {
      existingHeader.outerHTML = headerHTML;
    }
    // 🔵 الحالة 3: مافيه هيدر أبدًا → نضيف واحد جديد في أعلى الـ body
    else {
      const body = document.body;
      if (body) {
        body.insertAdjacentHTML('afterbegin', headerHTML);
      }
    }

    // تهيئة الوظائف المساندة
    initThemeToggle();
    initHeaderScroll();
    initDropdownHandlers();
    initLanguageSwitcher();

    // لو i18n متوفّر نعمل refresh بسيط بعد ما الهيدر يتركب
    if (window.i18n) {
      setTimeout(() => {
        window.i18n.refresh();
      }, 100);
    }
  }

  /**
   * 🌓 Theme toggle
   * - يحفظ الثيم في localStorage
   * - يحدّث الأيقونة والنص داخل الزر
   */
  function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // عشان ما يتصادم مع Script.js لو كان فيه تهيئة ثانية
    // Check if theme is already initialized elsewhere
    if (document.documentElement.hasAttribute('data-theme-initialized')) {
      return;
    }
    document.documentElement.setAttribute('data-theme-initialized', 'true');

    // Get saved theme or default to light (matching index.html behavior)
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    themeToggle.addEventListener('click', function () {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeButton(newTheme);
      
      // Refresh translation if i18n is available
      if (window.i18n) {
        window.i18n.refresh();
      }
    });
  }

  // تحديث شكل زر الثيم (الأيقونة + data-i18n للنص)
  function updateThemeButton(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('.theme-icon');
      const text = themeToggle.querySelector('.theme-text');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
      if (text) {
        text.setAttribute('data-i18n', theme === 'dark' ? 'common.light' : 'common.dark');
        // Refresh translation if i18n is available
        if (window.i18n) {
          window.i18n.refresh();
        }
      }
    }
  }

  /**
   * 🌐 Language switcher
   * - يغير بين en / ar باستخدام i18n.js
   * - يدعم نفس السلوك الموجود في index.html
   */
  function initLanguageSwitcher() {
    const langSwitcher = document.getElementById('language-switcher');
    if (!langSwitcher) return;

    // Wait for i18n to be ready
    const setupLangSwitcher = () => {
      if (window.i18n) {
        // Use the i18n module's setup if available
        if (window.i18n.setupLanguageSwitcher) {
          window.i18n.setupLanguageSwitcher();
        }
        
        // Also add direct handler (matching index.html behavior)
        langSwitcher.addEventListener('click', (e) => {
          if (window.i18n) {
            const currentLang = window.i18n.getLanguage();
            const newLang = currentLang === 'en' ? 'ar' : 'en';
            window.i18n.setLanguage(newLang);
          }
        });
      } else {
        // Retry if i18n not ready yet
        setTimeout(setupLangSwitcher, 100);
      }
    };

    // Start initialization
    setTimeout(setupLangSwitcher, 100);
  }

  /**
   * Scroll behavior للهيدر (إضافة كلاس scrolled بعد 100px)
   */
  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  /**
   * Dropdown handlers
   * - فتح/إغلاق قائمة Islamic Guide بالهوفر والفوكس
   * - مطابق للسلوك في index.html
   */
  function initDropdownHandlers() {
    const dropdowns = document.querySelectorAll('.nav .has-dropdown');

    dropdowns.forEach((dropdown) => {
      const dropdownMenu = dropdown.querySelector('.dropdown');
      const dropdownLink = dropdown.querySelector('a');

      if (dropdownMenu && dropdownLink) {
        let hoverTimeout;

        // Show dropdown on hover
        dropdown.addEventListener('mouseenter', () => {
          clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(() => {
            dropdownMenu.style.display = 'block';
            setTimeout(() => {
              dropdownMenu.style.opacity = '1';
              dropdownMenu.style.transform = 'translateY(0)';
            }, 10);
          }, 100);
        });

        // Hide dropdown when mouse leaves
        dropdown.addEventListener('mouseleave', () => {
          clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(() => {
            dropdownMenu.style.opacity = '0';
            dropdownMenu.style.transform = 'translateY(-10px)';
            setTimeout(() => {
              dropdownMenu.style.display = 'none';
            }, 300);
          }, 150);
        });

        // Keep dropdown open when hovering over it
        dropdownMenu.addEventListener('mouseenter', () => {
          clearTimeout(hoverTimeout);
          dropdownMenu.style.display = 'block';
          dropdownMenu.style.opacity = '1';
          dropdownMenu.style.transform = 'translateY(0)';
        });

        dropdownMenu.addEventListener('mouseleave', () => {
          clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(() => {
            dropdownMenu.style.opacity = '0';
            dropdownMenu.style.transform = 'translateY(-10px)';
            setTimeout(() => {
              dropdownMenu.style.display = 'none';
            }, 300);
          }, 150);
        });
      }
    });
  }

  // Inject header when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHeader);
  } else {
    injectHeader();
  }
})();