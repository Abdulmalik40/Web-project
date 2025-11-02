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
            <div class="brand-title">Visit Saudi Arabia</div>
            <div class="brand-sub">Explore regions, heritage, and faith</div>
          </div>
        </div>

        <div class="nav-container">
          <button
            class="theme-toggle"
            id="themeToggle"
            aria-label="Toggle theme"
          >
            🌙 Dark
          </button>

          <nav class="nav" aria-label="Main Navigation">
            <div class="item"><a href="${getLink('home')}">Home</a></div>
            <div class="item">
              <a href="map-interactive.html">Interactive Map</a>
            </div>
            <div class="item"><a href="${getLink('religious')}">Religious Sites</a></div>
            <div class="item"><a href="history.html">History</a></div>
            <div class="item"><a href="${getLink('heritage')}">Heritage</a></div>
            <div class="item"><a href="${getLink('regions')}">Regions</a></div>
            <div class="item has-dropdown">
              <a href="islamic-guide.html">Islamic Guide ▾</a>
              <div class="dropdown" role="menu">
                <a href="qibla.html" role="menuitem">Qibla Finder</a>
                <a href="prayer-times.html" role="menuitem">Prayer Times</a>
                <a href="quran.html" role="menuitem">Quran & Du'a</a>
                <a href="mosques.html" role="menuitem">Nearby Mosques</a>
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
      themeToggle.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
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
