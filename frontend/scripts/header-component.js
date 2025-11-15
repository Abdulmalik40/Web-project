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

  // Helper to get correct path for links داخل /pages/ أو من الصفحة الرئيسية
  function getLink(hash, file) {
    if (file) return file;                    // لو عطيناه ملف محدد استخدمه كما هو
    return isIndexPage ? `#${hash}` : `index.html#${hash}`; // غير كذا رجّعه للهوم مع الـ hash
  }

  /**
   * 🧱 Standard header HTML
   * - مطابق لهيدر index.html
   * - مع إضافة عناصر auth (login/register/profile/logout)
   */
  const headerHTML = `
    <header class="header" id="header">
      <div class="header-inner">
        <div class="brand" aria-label="Saudi Tourism">
          <div class="brand-mark" aria-hidden="true"></div>
          <div>
            <div class="brand-title" data-i18n="header.brandTitle">Visit Saudi Arabia</div>
            <div class="brand-sub" data-i18n="header.brandSub">Explore regions, heritage, and faith</div>
          </div>
        </div>

        <div class="nav-container">
          <!-- 🌐 زر تغيير اللغة (نفس index) -->
          <button
            class="language-toggle"
            id="language-switcher"
            aria-label="Toggle language"
            title="Switch Language"
          >
            <span class="lang-icon">🌐</span>
            <span class="lang-text" data-i18n="common.language">Language</span>
          </button>

          <!-- 🌙 زر الثيم (نفس index، لكن التحكم من هنا) -->
          <button
            class="theme-toggle"
            id="themeToggle"
            aria-label="Toggle theme"
          >
            <span class="theme-icon">🌙</span>
            <span class="theme-text" data-i18n="common.dark">Dark</span>
          </button>

          <nav class="nav" aria-label="Main Navigation">
            <!-- روابط التنقل الأساسية -->
            <div class="item">
              <a href="${getLink('home')}" data-i18n="common.home">Home</a>
            </div>

            <div class="item">
              <a href="map-interactive.html" data-i18n="common.interactiveMap">Interactive Map</a>
            </div>

            <div class="item">
              <a href="${getLink('religious')}" data-i18n="common.religiousSites">Religious Sites</a>
            </div>

            <div class="item">
              <a href="history.html" data-i18n="common.history">History</a>
            </div>

            <div class="item">
              <a href="${getLink('heritage')}" data-i18n="common.heritage">Heritage</a>
            </div>

            <div class="item">
              <a href="${getLink('regions')}" data-i18n="common.regions">Regions</a>
            </div>

            <!-- قائمة الدليل الإسلامي (نفس index) -->
            <div class="item has-dropdown">
              <a href="islamic-guide.html" data-i18n="common.islamicGuide">Islamic Guide ▾</a>
              <div class="dropdown" role="menu">
                <a href="qibla.html" role="menuitem" data-i18n="common.qiblaFinder">Qibla Finder</a>
                <a href="prayer-times.html" role="menuitem" data-i18n="common.prayerTimes">Prayer Times</a>
                <a href="quran.html" role="menuitem" data-i18n="common.quran">Quran & Du'a</a>
                <a href="mosques.html" role="menuitem" data-i18n="common.nearbyMosques">Nearby Mosques</a>
              </div>
            </div>

            <!-- 🆕 عناصر الدخول والتسجيل / البروفايل / تسجيل الخروج
                 نفس اللي في index.html وبنفس IDs عشان يشتغل auth-nav.js -->
            <div class="item" id="nav-login">
              <a href="login.html">Login</a>
            </div>

            <div class="item" id="nav-register">
              <a href="register.html">Register</a>
            </div>

            <!-- Profile & Logout (مخفية افتراضيًا) -->
            <div class="item" id="nav-profile" style="display: none;">
              <a href="profile.html">Profile</a>
            </div>

            <div class="item" id="nav-logout" style="display: none;">
              <a href="#" id="logoutBtn">Logout</a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  `;

  /**
   * injectHeader
   * - لو عندنا <header id="header" data-header-placeholder> يستبدله بالهيدر الموحّد
   * - أو يضيف هيدر جديد في بداية الـ body لو مافيه هيدر
   * - بعدين يفعّل الثيم + السكول + القائمة المنسدلة + اللغة
   */
  function injectHeader() {
    const existingHeader = document.getElementById('header');

    // 🟢 الحالة 1: موجود header فيه data-header-placeholder → نستبدله بالكامل
    if (existingHeader && existingHeader.hasAttribute('data-header-placeholder')) {
      existingHeader.outerHTML = headerHTML;
    }
    // 🟡 الحالة 2: هيدر موجود بدون placeholder → نضبط روابطه قدر الإمكان
    else if (existingHeader) {
      const navContainer = existingHeader.querySelector('.nav');
      if (navContainer) {
        const homeLink      = navContainer.querySelector('.item > a[href*="home"]');
        const religiousLink = navContainer.querySelector('.item > a[href*="religious"]');
        const heritageLink  = navContainer.querySelector('.item > a[href*="heritage"]');
        const regionsLink   = navContainer.querySelector('.item > a[href*="regions"]');

        if (homeLink)      homeLink.href      = getLink('home');
        if (religiousLink) religiousLink.href = getLink('religious');
        if (heritageLink)  heritageLink.href  = getLink('heritage');
        if (regionsLink)   regionsLink.href   = getLink('regions');

        // تأكدنا من الـ aria فوق البراند
        const brand = existingHeader.querySelector('.brand');
        if (brand && !brand.hasAttribute('aria-label')) {
          brand.setAttribute('aria-label', 'Saudi Tourism');
        }
        const brandMark = existingHeader.querySelector('.brand-mark');
        if (brandMark && !brandMark.hasAttribute('aria-hidden')) {
          brandMark.setAttribute('aria-hidden', 'true');
        }
      }
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
    document.documentElement.setAttribute('data-theme-initialized', 'true');

    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeButton(currentTheme);

    themeToggle.addEventListener('click', function () {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeButton(newTheme);
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
      }
    }
  }

  /**
   * 🌐 Language switcher
   * - يغير بين en / ar باستخدام i18n.js
   */
  function initLanguageSwitcher() {
    const langSwitcher = document.getElementById('language-switcher');
    if (langSwitcher && window.i18n) {
      langSwitcher.addEventListener('click', () => {
        const currentLang = window.i18n.getLanguage();
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        window.i18n.setLanguage(newLang);
      });
    }
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
   */
  function initDropdownHandlers() {
    const dropdownItems = document.querySelectorAll('.has-dropdown');
    dropdownItems.forEach((item) => {
      const dropdown = item.querySelector('.dropdown');
      if (!dropdown) return;

      item.addEventListener('mouseenter', function () {
        dropdown.style.display = 'block';
        setTimeout(() => {
          dropdown.style.opacity = '1';
          dropdown.style.transform = 'translateY(0)';
        }, 10);
      });

      item.addEventListener('mouseleave', function () {
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          dropdown.style.display = 'none';
        }, 300);
      });

      item.addEventListener('focusin', function () {
        dropdown.style.display = 'block';
        setTimeout(() => {
          dropdown.style.opacity = '1';
          dropdown.style.transform = 'translateY(0)';
        }, 10);
      });

      item.addEventListener('focusout', function (e) {
        if (!item.contains(e.relatedTarget)) {
          dropdown.style.opacity = '0';
          dropdown.style.transform = 'translateY(-10px)';
          setTimeout(() => {
            dropdown.style.display = 'none';
          }, 300);
        }
      });
    });
  }

  // Inject header when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHeader);
  } else {
    injectHeader();
  }
})();
