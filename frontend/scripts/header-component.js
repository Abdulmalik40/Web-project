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
              <a href="/frontend/pages/index.html#home" data-i18n="common.home">Home</a>
            </div>
            <div class="item">
              <a
                href="/frontend/pages/maps/map-interactive.html"
                data-i18n="common.interactiveMap"
              >Interactive Map</a>
            </div>
            <div class="item">
              <a href="/frontend/pages/core/history.html" data-i18n="common.history">
                History
              </a>
            </div>
            <div class="item has-dropdown">
              <a
                href="frontend/pages/islamic-guide/islamic-guide.html"
                data-i18n="common.islamicGuide"
              >Islamic Guide ▾</a>
              <div class="dropdown" role="menu">
                <a
                  href="/frontend/pages/islamic-guide/qibla.html"
                  role="menuitem"
                  data-i18n="common.qiblaFinder"
                >Qibla Finder</a>
                <a
                  href="/frontend/pages/islamic-guide/prayer-times.html"
                  role="menuitem"
                  data-i18n="common.prayerTimes"
                >Prayer Times</a>
                <a
                  href="/frontend/pages/islamic-guide/quran.html"
                  role="menuitem"
                  data-i18n="common.quran"
                >Quran &amp; Du'a</a>
              </div>
            </div>

            <!-- Login / Register -->
            <div class="item" id="nav-login">
              <a href="/frontend/pages/auth/login.html" data-i18n="common.login">Login</a>
            </div>
            <div class="item" id="nav-register">
              <a href="/frontend/pages/auth/register.html" data-i18n="common.register">Register</a>
            </div>

            <!-- Profile & Logout (hidden by default) -->
            <div
              class="item"
              id="nav-profile"
              style="display: none;"
            >
              <a href="/frontend/pages/user/profile.html" data-i18n="common.profile">Profile</a>
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
