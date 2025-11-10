/**
 * Header Component - Reusable header for all pages
 * This script ensures a consistent header navigation across all pages
 * Uses the exact structure and styling from index.html
 */

(function () {
  'use strict';

  // Get current page path to adjust navigation links
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || '';
  const isIndexPage = currentPage === 'index.html' || currentPage === '' || currentPage.endsWith('/');
  
  // Helper to get correct path for links
  function getLink(hash, file) {
    if (file) return file;
    return isIndexPage ? `#${hash}` : `index.html#${hash}`;
  }
  
  // Standard header HTML - matches index.html exactly
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
          <button
            class="language-toggle"
            id="language-switcher"
            aria-label="Toggle language"
            title="Switch Language"
          >
            <span class="lang-icon">🌐</span>
            <span class="lang-text" data-i18n="common.language">Language</span>
          </button>

          <button
            class="theme-toggle"
            id="themeToggle"
            aria-label="Toggle theme"
          >
            <span class="theme-icon">🌙</span>
            <span class="theme-text" data-i18n="common.dark">Dark</span>
          </button>

          <nav class="nav" aria-label="Main Navigation">
            <div class="item"><a href="${getLink('home')}" data-i18n="common.home">Home</a></div>
            <div class="item">
              <a href="map-interactive.html" data-i18n="common.interactiveMap">Interactive Map</a>
            </div>
            <div class="item"><a href="${getLink('religious')}" data-i18n="common.religiousSites">Religious Sites</a></div>
            <div class="item"><a href="history.html" data-i18n="common.history">History</a></div>
            <div class="item"><a href="${getLink('heritage')}" data-i18n="common.heritage">Heritage</a></div>
            <div class="item"><a href="${getLink('regions')}" data-i18n="common.regions">Regions</a></div>
            <div class="item has-dropdown">
              <a href="islamic-guide.html" data-i18n="common.islamicGuide">Islamic Guide ▾</a>
              <div class="dropdown" role="menu">
                <a href="qibla.html" role="menuitem" data-i18n="common.qiblaFinder">Qibla Finder</a>
                <a href="prayer-times.html" role="menuitem" data-i18n="common.prayerTimes">Prayer Times</a>
                <a href="quran.html" role="menuitem" data-i18n="common.quran">Quran & Du'a</a>
                <a href="mosques.html" role="menuitem" data-i18n="common.nearbyMosques">Nearby Mosques</a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  `;

  // Function to inject/replace header
  function injectHeader() {
    const existingHeader = document.getElementById('header');
    
    // If header exists with data-header-placeholder, replace it
    if (existingHeader && existingHeader.hasAttribute('data-header-placeholder')) {
      existingHeader.outerHTML = headerHTML;
    } 
    // If header exists but links might be different, update navigation only
    else if (existingHeader) {
      const navContainer = existingHeader.querySelector('.nav');
      if (navContainer) {
        // Update navigation links to match standard
        const homeLink = navContainer.querySelector('.item > a[href*="home"]');
        const religiousLink = navContainer.querySelector('.item > a[href*="religious"]');
        const heritageLink = navContainer.querySelector('.item > a[href*="heritage"]');
        const regionsLink = navContainer.querySelector('.item > a[href*="regions"]');
        
        if (homeLink) homeLink.href = getLink('home');
        if (religiousLink) religiousLink.href = getLink('religious');
        if (heritageLink) heritageLink.href = getLink('heritage');
        if (regionsLink) regionsLink.href = getLink('regions');
        
        // Ensure brand structure matches
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
    // Insert new header if none exists
    else {
      const body = document.body;
      if (body) {
        body.insertAdjacentHTML('afterbegin', headerHTML);
      }
    }
    
    // Initialize functionality
    initThemeToggle();
    initHeaderScroll();
    initDropdownHandlers();
    initLanguageSwitcher();
    
    // Refresh translations if i18n is available
    if (window.i18n) {
      setTimeout(() => {
        window.i18n.refresh();
      }, 100);
    }
  }

  // Initialize theme toggle
  function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // Mark as initialized to prevent Script.js from reinitializing
    document.documentElement.setAttribute('data-theme-initialized', 'true');

    // Get current theme or default to dark
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

  // Update theme button text
  function updateThemeButton(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('.theme-icon');
      const text = themeToggle.querySelector('.theme-text');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
      // Text will be updated by i18n module
      if (text) {
        text.setAttribute('data-i18n', theme === 'dark' ? 'common.light' : 'common.dark');
      }
    }
  }

  // Initialize language switcher
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

  // Initialize header scroll effect
  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;
    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    });
  }

  // Initialize dropdown handlers
  function initDropdownHandlers() {
    const dropdownItems = document.querySelectorAll('.has-dropdown');
    dropdownItems.forEach((item) => {
      const dropdown = item.querySelector('.dropdown');
      if (!dropdown) return;

      // Mouse events
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

      // Keyboard navigation
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
