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

      window.location.href = "/index.html";
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

  initEventSearch();
}

function initEventSearch() {
  const searchInput = document.getElementById('destination-search');
  const resultsContainer = document.getElementById('event-search-results');
  const emptyState = document.getElementById('destinations-empty-state');

  if (!searchInput || !resultsContainer) return;

  // Use i18n keys so searches match both Arabic and English titles/descriptions.
  // Each entry has a titleKey/descKey for i18n plus bilingual keywords for fuzzy search.
  const EVENTS = [
    // Makkah events/landmarks
    { titleKey: 'makkahPage.event1Title', descKey: 'makkahPage.event1Description', cityKey: 'destinations.makkah', cityFallback: 'Makkah', link: 'cities/makkah.html', keywords: ['الحرم', 'the grand mosque', 'the holy mosque', 'المسجد الحرام'] },
    { titleKey: 'makkahPage.event2Title', descKey: 'makkahPage.event2Description', cityKey: 'destinations.makkah', cityFallback: 'Makkah', link: 'cities/makkah.html', keywords: ['sky view', 'جولة بانورامية', 'makkah experience'] },
    { titleKey: 'makkahPage.event3Title', descKey: 'makkahPage.event3Description', cityKey: 'destinations.makkah', cityFallback: 'Makkah', link: 'cities/makkah.html', keywords: ['hira cultural district', 'حي حراء', 'مكة ترحب بنا'] },
    { titleKey: 'makkahPage.section2Title', descKey: 'makkahPage.section2Para1', cityKey: 'destinations.makkah', cityFallback: 'Makkah', link: 'cities/makkah.html#modern-kingdom', keywords: ['المسجد الحرام', 'grand mosque', 'kaaba', 'الكعبة', 'zamzam', 'زمزم'] },
    { titleKey: 'makkahPage.section3Title', descKey: 'makkahPage.section3Para1', cityKey: 'destinations.makkah', cityFallback: 'Makkah', link: 'cities/makkah.html#modern-kingdom', keywords: ['المشاعر المقدسة', 'sacred sites', 'منى', 'عرفات', 'مزدلفة', 'قطار المشاعر'] },
    { titleKey: 'makkahPage.section1Item3', descKey: 'makkahPage.section1Para3', cityKey: 'destinations.makkah', cityFallback: 'Makkah', link: 'cities/makkah.html#first-state', keywords: ['جبل النور', 'hira cave', 'جبل حراء', 'jabal al nour'] },
    { titleKey: 'makkahPage.section1Item4', descKey: 'makkahPage.section2Para1', cityKey: 'destinations.makkah', cityFallback: 'Makkah', link: 'cities/makkah.html#first-state', keywords: ['بئر زمزم', 'zamzam well', 'ماء زمزم'] },
    { titleKey: 'makkahPage.section1Item5', descKey: 'makkahPage.section2Para1', cityKey: 'destinations.makkah', cityFallback: 'Makkah', link: 'cities/makkah.html#first-state', keywords: ['مجمع الملك عبد العزيز لكسوة الكعبة', 'kiswah', 'kaaba complex'] },

    // Madinah events/landmarks
    { titleKey: 'madinahPage.event1Title', descKey: 'madinahPage.event1Description', cityKey: 'destinations.madinah', cityFallback: 'Madinah', link: 'cities/madinah.html', keywords: ['معرض الكتاب', 'book fair', 'madinah'] },
    { titleKey: 'madinahPage.event2Title', descKey: 'madinahPage.event2Description', cityKey: 'destinations.madinah', cityFallback: 'Madinah', link: 'cities/madinah.html', keywords: ['legacy tour', 'جولة تراثية', 'madinah'] },
    { titleKey: 'madinahPage.event3Title', descKey: 'madinahPage.event3Description', cityKey: 'destinations.madinah', cityFallback: 'Madinah', link: 'cities/madinah.html', keywords: ['prophet biography', 'المعرض الدولي للسيرة', 'madinah'] },
    { titleKey: 'madinahPage.section1Item1', descKey: 'madinahPage.section3Para1', cityKey: 'destinations.madinah', cityFallback: 'Madinah', link: 'cities/madinah.html#first-state', keywords: ['المسجد النبوي', 'prophets mosque', 'الروضة'] },
    { titleKey: 'madinahPage.section1Item2', descKey: 'madinahPage.section5Para1', cityKey: 'destinations.madinah', cityFallback: 'Madinah', link: 'cities/madinah.html#first-state', keywords: ['مسجد قباء', 'quba mosque', 'first mosque'] },
    { titleKey: 'madinahPage.section1Item3', descKey: 'madinahPage.section4Para1', cityKey: 'destinations.madinah', cityFallback: 'Madinah', link: 'cities/madinah.html#modern-kingdom', keywords: ['جبل أحد', 'mount uhud'] },
    { titleKey: 'madinahPage.section1Item4', descKey: 'madinahPage.section6Para1', cityKey: 'destinations.madinah', cityFallback: 'Madinah', link: 'cities/madinah.html#modern-kingdom', keywords: ['مسجد القبلتين', 'qiblatain', 'trench', 'mount sela'] },
    { titleKey: 'madinahPage.section1Item5', descKey: 'madinahPage.section1Para3', cityKey: 'destinations.madinah', cityFallback: 'Madinah', link: 'cities/madinah.html#first-state', keywords: ['متحف المدينة', 'dar al madinah museum'] },
    { titleKey: 'madinahPage.section2Item3', descKey: 'madinahPage.section2Para1', cityKey: 'destinations.madinah', cityFallback: 'Madinah', link: 'cities/madinah.html#modern-kingdom', keywords: ['موقع الخندق', 'جبل سلع', 'trench', 'mount sela'] },
    { titleKey: 'madinahPage.section2Item4', descKey: 'madinahPage.section2Para1', cityKey: 'destinations.madinah', cityFallback: 'Madinah', link: 'cities/madinah.html#modern-kingdom', keywords: ['ميقات ذو الحليفة', 'ابيار علي', 'miqat dhu al hulaifah', 'abyar ali'] },

    // Jeddah events/landmarks
    { titleKey: 'jeddahPage.event1Title', descKey: 'jeddahPage.event1Description', cityKey: 'destinations.jeddah', cityFallback: 'Jeddah', link: 'cities/jeddah.html', keywords: ['world rally championship', 'رالي', 'jeddah'] },
    { titleKey: 'jeddahPage.event2Title', descKey: 'jeddahPage.event2Description', cityKey: 'destinations.jeddah', cityFallback: 'Jeddah', link: 'cities/jeddah.html', keywords: ['f1h2o', 'قوارب', 'jeddah'] },
    { titleKey: 'jeddahPage.event3Title', descKey: 'jeddahPage.event3Description', cityKey: 'destinations.jeddah', cityFallback: 'Jeddah', link: 'cities/jeddah.html', keywords: ['winter wonderland', 'وينتر وندرلاند', 'jeddah'] },
    { titleKey: 'jeddahPage.section1Item1', descKey: 'jeddahPage.section1Para1', cityKey: 'destinations.jeddah', cityFallback: 'Jeddah', link: 'cities/jeddah.html', keywords: ['balad', 'البلد', 'historic district'] },
    { titleKey: 'jeddahPage.section1Item2', descKey: 'jeddahPage.section2Para1', cityKey: 'destinations.jeddah', cityFallback: 'Jeddah', link: 'cities/jeddah.html', keywords: ['corniche', 'الكورنيش', 'red sea waterfront'] },
    { titleKey: 'jeddahPage.section1Item3', descKey: 'jeddahPage.section3Para1', cityKey: 'destinations.jeddah', cityFallback: 'Jeddah', link: 'cities/jeddah.html', keywords: ['king fahd fountain', 'نافورة الملك فهد'] },

    // AlUla events/landmarks
    { titleKey: 'alulaPage.event1Title', descKey: 'alulaPage.event1Description', cityKey: 'destinations.northernRegion', cityFallback: 'AlUla', link: 'cities/alula.html', keywords: ['annabels', 'عشاء فاخر', 'alula'] },
    { titleKey: 'alulaPage.event2Title', descKey: 'alulaPage.event2Description', cityKey: 'destinations.northernRegion', cityFallback: 'AlUla', link: 'cities/alula.html', keywords: ['hegra drone show', 'عرض الطائرات بدون طيار', 'alula'] },
    { titleKey: 'alulaPage.event3Title', descKey: 'alulaPage.event3Description', cityKey: 'destinations.northernRegion', cityFallback: 'AlUla', link: 'cities/alula.html', keywords: ['ancient kingdoms festival', 'ممالك قديمة', 'alula'] },
    { titleKey: 'alulaPage.section1Item1', descKey: 'alulaPage.section2Para1', cityKey: 'destinations.northernRegion', cityFallback: 'AlUla', link: 'cities/alula.html', keywords: ['hegra', 'madain saleh', 'الحجر'] },
    { titleKey: 'alulaPage.section1Item2', descKey: 'alulaPage.section4Para1', cityKey: 'destinations.northernRegion', cityFallback: 'AlUla', link: 'cities/alula.html', keywords: ['elephant rock', 'جبل الفيل'] },
    { titleKey: 'alulaPage.section1Item5', descKey: 'alulaPage.section7Para1', cityKey: 'destinations.northernRegion', cityFallback: 'AlUla', link: 'cities/alula.html', keywords: ['maraya', 'مرايا'] },

    // Aseer events/landmarks
    { titleKey: 'aseerPage.event1Title', descKey: 'aseerPage.event1Description', cityKey: 'destinations.southernRegion', cityFallback: 'Aseer', link: 'cities/aseer.html', keywords: ['aseer season', 'موسم عسير'] },
    { titleKey: 'aseerPage.event2Title', descKey: 'aseerPage.event2Description', cityKey: 'destinations.southernRegion', cityFallback: 'Aseer', link: 'cities/aseer.html', keywords: ['nafas', 'نفَس', 'ابها'] },
    { titleKey: 'aseerPage.event3Title', descKey: 'aseerPage.event3Description', cityKey: 'destinations.southernRegion', cityFallback: 'Aseer', link: 'cities/aseer.html', keywords: ['discover essence of asir', 'جولة خمسة أيام'] },
    { titleKey: 'aseerPage.section1Item1', descKey: 'aseerPage.section3Para1', cityKey: 'destinations.southernRegion', cityFallback: 'Aseer', link: 'cities/aseer.html', keywords: ['rijal almaa', 'رجال ألمع'] },
    { titleKey: 'aseerPage.section1Item2', descKey: 'aseerPage.section2Para1', cityKey: 'destinations.southernRegion', cityFallback: 'Aseer', link: 'cities/aseer.html', keywords: ['jabal soudah', 'السودة'] },
    { titleKey: 'aseerPage.section2Title', descKey: 'aseerPage.section2Para1', cityKey: 'destinations.southernRegion', cityFallback: 'Aseer', link: 'cities/aseer.html', keywords: ['al-soudah', 'sarawat heights', 'السودة', 'سراة'] },
    { titleKey: 'aseerPage.section3Title', descKey: 'aseerPage.section3Para1', cityKey: 'destinations.southernRegion', cityFallback: 'Aseer', link: 'cities/aseer.html', keywords: ['rijal almaa heritage village', 'رجال ألمع'] },
    { titleKey: 'aseerPage.section4Title', descKey: 'aseerPage.section4Para1', cityKey: 'destinations.southernRegion', cityFallback: 'Aseer', link: 'cities/aseer.html', keywords: ['abha heart of aseer', 'ابها قلب عسير'] },
    { titleKey: 'aseerPage.section5Title', descKey: 'aseerPage.section5Para1', cityKey: 'destinations.southernRegion', cityFallback: 'Aseer', link: 'cities/aseer.html', keywords: ['al-muftaha arts village', 'قرية المفتاحة'] },
    { titleKey: 'aseerPage.section6Title', descKey: 'aseerPage.section6Para1', cityKey: 'destinations.southernRegion', cityFallback: 'Aseer', link: 'cities/aseer.html', keywords: ['aseer national park', 'حديقة عسير الوطنية'] },

    // Al-Khobar events/landmarks
    { titleKey: 'alkhobarPage.event1Title', descKey: 'alkhobarPage.event1Description', cityKey: 'destinations.easternRegion', cityFallback: 'Al-Khobar', link: 'cities/alkhobar.html', keywords: ['khobar season', 'breeze festival', 'كورنيش الخبر'] },
    { titleKey: 'alkhobarPage.event2Title', descKey: 'alkhobarPage.event2Description', cityKey: 'destinations.easternRegion', cityFallback: 'Al-Khobar', link: 'cities/alkhobar.html', keywords: ['big bounce', 'ارابيا', 'العاب هوائية'] },
    { titleKey: 'alkhobarPage.event3Title', descKey: 'alkhobarPage.event3Description', cityKey: 'destinations.easternRegion', cityFallback: 'Al-Khobar', link: 'cities/alkhobar.html', keywords: ['jalasat', 'جلسات الخبر'] },
    { titleKey: 'alkhobarPage.section2Title', descKey: 'alkhobarPage.section2Para1', cityKey: 'destinations.easternRegion', cityFallback: 'Al-Khobar', link: 'cities/alkhobar.html', keywords: ['waterfront', 'corniche', 'الكورنيش', 'الواجهة البحرية'] },
    { titleKey: 'alkhobarPage.section1Item2', descKey: 'alkhobarPage.section6Para1', cityKey: 'destinations.easternRegion', cityFallback: 'Al-Khobar', link: 'cities/alkhobar.html', keywords: ['ithra', 'اثرء', 'king abdulaziz world cultural center'] },
    { titleKey: 'alkhobarPage.section3Title', descKey: 'alkhobarPage.section3Para1', cityKey: 'destinations.easternRegion', cityFallback: 'Al-Khobar', link: 'cities/alkhobar.html', keywords: ['king fahd causeway', 'جسر الملك فهد', 'bahrain bridge'] },
    { titleKey: 'alkhobarPage.section5Title', descKey: 'alkhobarPage.section5Para1', cityKey: 'destinations.easternRegion', cityFallback: 'Al-Khobar', link: 'cities/alkhobar.html', keywords: ['scitech', 'science center', 'سايتك'] },
    { titleKey: 'alkhobarPage.section6Title', descKey: 'alkhobarPage.section6Para1', cityKey: 'destinations.easternRegion', cityFallback: 'Al-Khobar', link: 'cities/alkhobar.html', keywords: ['ithra', 'اثرء', 'الظهران'] },
    { titleKey: 'alkhobarPage.section1Item1', descKey: 'alkhobarPage.section2Para1', cityKey: 'destinations.easternRegion', cityFallback: 'Al-Khobar', link: 'cities/alkhobar.html', keywords: ['corniche', 'الكورنيش', 'waterfront'] },
    { titleKey: 'alkhobarPage.section1Item3', descKey: 'alkhobarPage.section2Para1', cityKey: 'destinations.easternRegion', cityFallback: 'Al-Khobar', link: 'cities/alkhobar.html', keywords: ['half moon bay', 'شاطئ نصف القمر'] },

    // Riyadh landmarks
    { titleKey: 'riyadhPage.section2Title', descKey: 'riyadhPage.section2Para1', cityKey: 'destinations.capital', cityFallback: 'Riyadh', link: 'cities/riyadh.html', keywords: ['diriyah', 'الدرعية', 'wadi hanifa', 'وادي حنيفة'] },
    { titleKey: 'riyadhPage.section2Item1', descKey: 'riyadhPage.section2Para1', cityKey: 'destinations.capital', cityFallback: 'Riyadh', link: 'cities/riyadh.html', keywords: ['at-turaif', 'الطريف'] },
    { titleKey: 'riyadhPage.section2Item3Title', descKey: 'riyadhPage.section2Item3Desc', cityKey: 'destinations.capital', cityFallback: 'Riyadh', link: 'cities/riyadh.html', keywords: ['edge of the world', 'حافة العالم', 'jebel fihrayn'] },
    { titleKey: 'riyadhPage.section2Item2Title', descKey: 'riyadhPage.section2Item2Desc', cityKey: 'destinations.capital', cityFallback: 'Riyadh', link: 'cities/riyadh.html', keywords: ['diriyah squares', 'ساحات الدرعية'] },
    { titleKey: 'riyadhPage.section4Title', descKey: 'riyadhPage.section4Para1', cityKey: 'destinations.capital', cityFallback: 'Riyadh', link: 'cities/riyadh.html#section4', keywords: ['at-turaif district', 'الطريف', 'diriyah'] },
    { titleKey: 'riyadhPage.section5Title', descKey: 'riyadhPage.section5Para1', cityKey: 'destinations.capital', cityFallback: 'Riyadh', link: 'cities/riyadh.html#section5', keywords: ['masmak fort', 'قصر المصمك', 'qasr al hukm'] },
    { titleKey: 'riyadhPage.section6Title', descKey: 'riyadhPage.section6Para1', cityKey: 'destinations.capital', cityFallback: 'Riyadh', link: 'cities/riyadh.html#section6', keywords: ['national museum', 'المتحف الوطني', 'al-murabba', 'المربع'] },
    { titleKey: 'riyadhPage.section7Title', descKey: 'riyadhPage.section7Para1', cityKey: 'destinations.capital', cityFallback: 'Riyadh', link: 'cities/riyadh.html#section7', keywords: ['boulevard riyadh city', 'بوليفارد الرياض'] },
    { titleKey: 'riyadhPage.section8Title', descKey: 'riyadhPage.section8Para1', cityKey: 'destinations.capital', cityFallback: 'Riyadh', link: 'cities/riyadh.html#section8', keywords: ['kafd', 'king abdullah financial district', 'كافد'] },
    { titleKey: 'riyadhPage.section9Title', descKey: 'riyadhPage.section9Para1', cityKey: 'destinations.capital', cityFallback: 'Riyadh', link: 'cities/riyadh.html#section9', keywords: ['king abdullah garden', 'حديقة الملك عبدالله'] },
    { titleKey: 'riyadhPage.section10Title', descKey: 'riyadhPage.section10Para1', cityKey: 'destinations.capital', cityFallback: 'Riyadh', link: 'cities/riyadh.html#section10', keywords: ['edge of the world', 'حافة العالم', 'jebel fihrayn'] },
    { titleKey: 'riyadhPage.section3Item1', descKey: 'riyadhPage.section3Para1', cityKey: 'destinations.capital', cityFallback: 'Riyadh', link: 'cities/riyadh.html#section3', keywords: ['king khalid international airport', 'مطار الملك خالد'] },
    { titleKey: 'riyadhPage.section3Item3', descKey: 'riyadhPage.section3Para3', cityKey: 'destinations.capital', cityFallback: 'Riyadh', link: 'cities/riyadh.html#section3', keywords: ['parks', 'حدائق', 'green projects'] },
    { titleKey: 'riyadhPage.section3Item4', descKey: 'riyadhPage.section3Para3', cityKey: 'destinations.capital', cityFallback: 'Riyadh', link: 'cities/riyadh.html#section3', keywords: ['museums', 'معارض', 'cultural fronts'] },

    // General/other events
    { titleKey: 'events.saudiFalconCup.title', descKey: 'events.saudiFalconCup.description', cityFallback: 'Riyadh', link: 'cities/riyadh.html', keywords: ['falcon cup', 'صقور الرياض'] },
    { titleKey: 'events.generalAviationAirshow.title', descKey: 'events.generalAviationAirshow.description', cityFallback: 'Riyadh', link: 'cities/riyadh.html', keywords: ['general aviation airshow', 'معرض الطيران العام'] },
    { titleKey: 'events.blackHatMEA.title', descKey: 'events.blackHatMEA.description', cityFallback: 'Riyadh', link: 'cities/riyadh.html', keywords: ['black hat', 'الامن السيبراني', 'الأمن السيبراني'] }
  ];



  const getTranslation = (lang, key) => {
    if (!key || !window.i18n || !window.i18n.translations) return '';
    const parts = key.split('.');
    let value = window.i18n.translations[lang];
    parts.forEach((p) => {
      value = value?.[p];
    });
    return typeof value === 'string' ? value : '';
  };

  const getDisplayValue = (key, fallback) => {
    if (window.i18n?.t) {
      const translated = window.i18n.t(key);
      if (translated && translated !== key) return translated;
    }
    return getTranslation('en', key) || fallback || '';
  };

  const filterCards = () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      resultsContainer.innerHTML = '';
      resultsContainer.hidden = true;
      if (emptyState) emptyState.hidden = true;
      return;
    }

    const matches = EVENTS.filter((event) => {
      const enTitle = getTranslation('en', event.titleKey);
      const arTitle = getTranslation('ar', event.titleKey);
      const enDesc = event.descKey ? getTranslation('en', event.descKey) : '';
      const arDesc = event.descKey ? getTranslation('ar', event.descKey) : '';
      const haystack = `${enTitle} ${arTitle} ${enDesc} ${arDesc} ${event.keywords || ''}`.toLowerCase();
      return haystack.includes(query);
    });

    // Deduplicate by title + link to avoid repeated cards
    const uniqueMatches = [];
    const seen = new Set();
    matches.forEach((event) => {
      const key = `${event.titleKey}|${event.link}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueMatches.push(event);
      }
    });

    if (uniqueMatches.length === 0) {
      resultsContainer.innerHTML = '';
      resultsContainer.hidden = true;
      if (emptyState) emptyState.hidden = true;
      return;
    }

    const markup = uniqueMatches.map((event) => {
      const title = getDisplayValue(event.titleKey, event.titleFallback);
      const description = event.descKey ? getDisplayValue(event.descKey, event.descriptionFallback) : '';
      const cityLabel = event.cityKey
        ? getDisplayValue(event.cityKey, event.cityFallback)
        : event.cityFallback || '';

      return `
      <a class="event-result-card" href="${event.link}">
        <div class="event-meta">
          <span class="material-symbols-rounded" aria-hidden="true">event</span>
          <div>
            <p class="event-city">${cityLabel}</p>
            <h4 class="event-title">${title}</h4>
          </div>
        </div>
        <p class="event-desc">${description}</p>
        <div class="event-cta">
          <span>View city</span>
          <span class="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
        </div>
      </a>
    `;
    }).join('');

    resultsContainer.innerHTML = markup;
    resultsContainer.hidden = false;
    if (emptyState) emptyState.hidden = true;
  };

  searchInput.addEventListener('input', filterCards);
  if (window.i18n?.subscribe) {
    window.i18n.subscribe(filterCards);
  }
  filterCards();
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
