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

  /**
   * 🧱 Standard header HTML
   * - مطابق لهيدر index.html بالضبط
   * - مع إضافة عناصر auth (login/register/profile/logout)
   * - نستخدم روابط تبدأ من الجذر / حتى تشتغل من أي صفحة
   */
  function getHeaderHTML() {
    const headerClass = 'header site-header';

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
              <!-- Home section on index page -->
              <a href="/#home" data-i18n="common.home">Home</a>
            </div>
            <div class="item">
              <a
                href="/maps/maplibre.html"
                data-i18n="common.interactiveMap"
              >Interactive Map</a>
            </div>
            <div class="item">
              <a href="/core/history.html" data-i18n="common.history">
                History
              </a>
            </div>
            <div class="item has-dropdown">
              <a
                href="/islamic-guide/islamic-guide.html"
                data-i18n="common.islamicGuide"
              >Islamic Guide ▾</a>
              <div class="dropdown" role="menu">
                <a
                  href="/islamic-guide/qibla.html"
                  role="menuitem"
                  data-i18n="common.qiblaFinder"
                >Qibla Finder</a>
                <a
                  href="/islamic-guide/prayer-times.html"
                  role="menuitem"
                  data-i18n="common.prayerTimes"
                >Prayer Times</a>
                <a
                  href="/islamic-guide/quran.html"
                  role="menuitem"
                  data-i18n="common.quran"
                >Quran &amp; Du'a</a>
              </div>
            </div>

            <!-- Login / Register -->
            <div class="item" id="nav-login">
              <a href="/auth/login.html" data-i18n="common.login">Login</a>
            </div>
            <div class="item" id="nav-register">
              <a href="/auth/register.html" data-i18n="common.register">Register</a>
            </div>

            <!-- Profile & Logout (hidden by default) -->
            <div
              class="item"
              id="nav-profile"
              style="display: none;"
            >
              <a href="/user/profile.html" data-i18n="common.profile">Profile</a>
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
   * injectHeaderwww
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
    // 🟡 الحالة 2: هيدر موجود بدون placeholder → نستبدله بالكامل
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

    // عشان ما يتصادم مع سكربتات ثانية
    if (document.documentElement.hasAttribute('data-theme-initialized')) {
      return;
    }
    document.documentElement.setAttribute('data-theme-initialized', 'true');

    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    themeToggle.addEventListener('click', function () {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeButton(newTheme);

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
        if (window.i18n) {
          window.i18n.refresh();
        }
      }
    }
  }

  /**
   * 🌐 Language switcher
   * - يغير بين en / ar باستخدام i18n.js
   */
  function initLanguageSwitcher() {
    const langSwitcher = document.getElementById('language-switcher');
    if (!langSwitcher) return;

    const setupLangSwitcher = () => {
      if (window.i18n) {
        // لو في setup جاهز داخل i18n استخدمه
        if (window.i18n.setupLanguageSwitcher) {
          window.i18n.setupLanguageSwitcher();
        }

        // handler مباشر بسيط
        langSwitcher.addEventListener('click', () => {
          if (window.i18n) {
            const currentLang = window.i18n.getLanguage();
            const newLang = currentLang === 'en' ? 'ar' : 'en';
            window.i18n.setLanguage(newLang);
          }
        });
      } else {
        // لو i18n ما جاهز، نحاول بعد شوي
        setTimeout(setupLangSwitcher, 100);
      }
    };

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
   * - فتح/إغلاق قائمة Islamic Guide
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
