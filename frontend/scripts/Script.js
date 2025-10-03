// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeToggle(savedTheme);

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Add smooth transition
  body.style.transition = 'all 0.3s ease';
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeToggle(newTheme);
  
  // Remove transition after animation
  setTimeout(() => {
    body.style.transition = '';
  }, 300);
});

// Update theme toggle button text and icon
function updateThemeToggle(theme) {
  themeToggle.innerHTML = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

// Header scroll effect with enhanced animations
const header = document.getElementById('header');
const scrollIndicator = document.querySelector('.scroll-indicator');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  
  // Header scroll effect
  if (scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // Hide scroll indicator when user starts scrolling
  if (scrollIndicator) {
    if (scrollY > 50) {
      scrollIndicator.classList.add('hidden');
    } else {
      scrollIndicator.classList.remove('hidden');
    }
  }
  
  // Update parallax
  requestTick();
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerHeight = header.offsetHeight;
      const targetPosition = target.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Enhanced card hover effects
document.querySelectorAll('.destination-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-12px) scale(1.02)';
    this.style.boxShadow = 'var(--shadow-xl)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
    this.style.boxShadow = 'var(--shadow-sm)';
  });
  
  // Add click ripple effect
  card.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(0, 98, 51, 0.1);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;
    
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Program card hover effects
document.querySelectorAll('.program-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-6px)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});

// Button click animations
document.querySelectorAll('.explore-btn').forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Add loading animation
    const originalText = this.innerHTML;
    this.innerHTML = '⟳ Loading...';
    this.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
      this.innerHTML = originalText;
      this.style.transform = 'scale(1)';
      
      // Scroll to regions section
      const regionsSection = document.getElementById('regions');
      if (regionsSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = regionsSection.offsetTop - headerHeight - 100;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }, 1000);
  });
});

// Enhanced parallax effect for hero section
let ticking = false;

function updateParallax() {
  const scrolled = window.pageYOffset;
  const heroImage = document.querySelector('.hero-image');
  const heroContent = document.querySelector('.hero-content');
  const heroParticles = document.querySelectorAll('.particle');
  
  if (heroImage) {
    heroImage.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
  }
  
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
    heroContent.style.opacity = Math.max(0, 1 - scrolled / 600);
  }
  
  // Animate particles with different speeds
  heroParticles.forEach((particle, index) => {
    const speed = 0.2 + (index * 0.1);
    particle.style.transform = `translateY(${scrolled * speed}px)`;
  });
  
  ticking = false;
}

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

window.addEventListener('scroll', requestTick);

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.program-card, .program-header').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
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

// Navigation active state
function setActiveNavItem() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav .item a');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - header.offsetHeight - 100;
    const sectionHeight = section.offsetHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${currentSection}`) {
      item.classList.add('active');
    }
  });
}

// Update active nav item on scroll
window.addEventListener('scroll', setActiveNavItem);

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

// Enhanced hero animations and effects
document.addEventListener('DOMContentLoaded', () => {
  // Set initial active nav item
  setActiveNavItem();
  
  // Hero text typing effect
  const titleLines = document.querySelectorAll('.title-line');
  titleLines.forEach((line, index) => {
    line.style.animationDelay = `${0.5 + (index * 0.3)}s`;
  });
  
  // Hero CTA buttons enhanced animations
  document.querySelectorAll('.cta-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: scale(0);
        animation: ctaRipple 0.6s ease-out;
        pointer-events: none;
      `;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
        
        // Scroll to content
        if (this.textContent.includes('Journey')) {
          const banner = document.querySelector('.banner');
          if (banner) {
            banner.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }, 600);
    });
  });
  
  // Scroll indicator functionality
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const banner = document.querySelector('.banner');
      if (banner) {
        banner.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }
  
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
});
// ======================
// QURAN RECITATION API
// ======================

// Only run if on quran.html page
if (document.querySelector('.quran-container')) {
  const API_BASE_URL = 'https://www.mp3quran.net/api/v3/reciters';
  const languageSelect = document.getElementById('languageSelect');
  const reciterSelect = document.getElementById('reciterSelect');
  const surahSelect = document.getElementById('surahSelect');
  const loadBtn = document.getElementById('loadBtn');
  const playerSection = document.getElementById('playerSection');
  const audioPlayer = document.getElementById('audioPlayer');
  const currentReciter = document.getElementById('currentReciter');
  const currentSurah = document.getElementById('currentSurah');
  const errorContainer = document.getElementById('errorContainer');
  const loading = document.getElementById('loading');

  let recitersData = [];

  const arabicSurahNames = [
    "", "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
    "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون",
    "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ",
    "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف",
    "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة",
    "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة",
    "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
    "التكوير", "الإنفطار", "المطففين", "الإنشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
    "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة",
    "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص",
    "الفلق", "الناس"
  ];

  const englishSurahNames = [
    "", "Al-Fatiha", "Al-Baqara", "Ali 'Imran", "An-Nisa", "Al-Ma'ida", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawba", "Yunus",
    "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "Al-Isra", "Al-Kahf", "Maryam", "Taha", "Al-Anbiya", "Al-Hajj", "Al-Mu'minun",
    "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-'Ankabut", "Ar-Rum", "Luqman", "As-Sajda", "Al-Ahzab", "Saba",
    "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiya", "Al-Ahqaf",
    "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'a", "Al-Hadid", "Al-Mujadila",
    "Al-Hashr", "Al-Mumtahana", "As-Saff", "Al-Jumu'a", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haaqqa",
    "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyama", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "'Abasa",
    "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiya", "Al-Fajr", "Al-Balad",
    "Ash-Shams", "Al-Lail", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyina", "Az-Zalzala", "Al-'Adiyat", "Al-Qari'a",
    "At-Takathur", "Al-'Asr", "Al-Humaza", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas",
    "Al-Falaq", "An-Nas"
  ];

  async function fetchReciters() {
    const language = languageSelect.value;
    const url = `${API_BASE_URL}?language=${language}`;
    
    try {
      loading.style.display = 'block';
      errorContainer.style.display = 'none';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      recitersData = data.reciters || [];
      
      reciterSelect.innerHTML = '<option value="">Select a reciter</option>';
      recitersData.forEach(reciter => {
        const option = document.createElement('option');
        option.value = reciter.id;
        option.textContent = reciter.name;
        reciterSelect.appendChild(option);
      });
      
      reciterSelect.disabled = false;
      surahSelect.disabled = true;
      surahSelect.innerHTML = '<option value="">Select a reciter first</option>';
      loadBtn.disabled = true;
      
    } catch (error) {
      console.error('Error fetching reciters:', error);
      errorContainer.textContent = 'Failed to load reciters. Please try again later.';
      errorContainer.style.display = 'block';
    } finally {
      loading.style.display = 'none';
    }
  }

  function populateSurahs() {
    const reciterId = reciterSelect.value;
    if (!reciterId) {
      surahSelect.disabled = true;
      surahSelect.innerHTML = '<option value="">Select a reciter first</option>';
      loadBtn.disabled = true;
      return;
    }

    const reciter = recitersData.find(r => r.id == reciterId);
    if (!reciter || !reciter.moshaf || reciter.moshaf.length === 0) {
      surahSelect.disabled = true;
      surahSelect.innerHTML = '<option value="">No surahs available</option>';
      loadBtn.disabled = true;
      return;
    }

    const surahList = reciter.moshaf[0].surah_list.split(',').map(Number);
    surahSelect.innerHTML = '<option value="">Select a surah</option>';
    
    surahList.forEach(surahNum => {
      const option = document.createElement('option');
      option.value = surahNum;
      const language = languageSelect.value;
      const surahName = language === 'ar' ? arabicSurahNames[surahNum] : englishSurahNames[surahNum];
      option.textContent = `${surahNum}. ${surahName}`;
      surahSelect.appendChild(option);
    });

    surahSelect.disabled = false;
    loadBtn.disabled = !(reciterSelect.value && surahSelect.value);
  }

  function loadAudio() {
    const reciterId = reciterSelect.value;
    const surahId = surahSelect.value;
    
    if (!reciterId || !surahId) {
      errorContainer.textContent = 'Please select both a reciter and a surah.';
      errorContainer.style.display = 'block';
      return;
    }

    const reciter = recitersData.find(r => r.id == reciterId);
    if (!reciter || !reciter.moshaf || reciter.moshaf.length === 0) {
      errorContainer.textContent = 'Selected reciter has no available recordings.';
      errorContainer.style.display = 'block';
      return;
    }

    const serverUrl = reciter.moshaf[0].server.trim();
    const audioUrl = `${serverUrl}${String(surahId).padStart(3, '0')}.mp3`;
    
    currentReciter.textContent = reciter.name;
    const language = languageSelect.value;
    const surahName = language === 'ar' ? arabicSurahNames[surahId] : englishSurahNames[surahId];
    currentSurah.textContent = `${surahId}. ${surahName}`;
    
    audioPlayer.src = audioUrl;
    audioPlayer.style.display = 'block';
    playerSection.style.display = 'block';
    
    audioPlayer.play().catch(e => console.warn('Auto-play failed:', e));
  }

  languageSelect.addEventListener('change', fetchReciters);
  reciterSelect.addEventListener('change', populateSurahs);
  surahSelect.addEventListener('change', () => {
    loadBtn.disabled = !(reciterSelect.value && surahSelect.value);
  });
  loadBtn.addEventListener('click', loadAudio);

  // Initialize
  fetchReciters();
}
// ======================
// QIBLA FINDER API
// ======================

// Only run if on qibla.html page
if (document.querySelector('.qibla-container')) {
  const API_BASE_URL = 'https://api.aladhan.com/v1/qibla';
  const useLocationBtn = document.getElementById('useLocationBtn');
  const manualBtn = document.getElementById('manualBtn');
  const latitudeInput = document.getElementById('latitudeInput');
  const longitudeInput = document.getElementById('longitudeInput');
  const errorContainer = document.getElementById('errorContainer');
  const loading = document.getElementById('loading');
  const resultSection = document.getElementById('resultSection');
  const compassNeedle = document.getElementById('compassNeedle');
  const directionText = document.getElementById('directionText');
  const coordinatesText = document.getElementById('resultCoords');

  function showError(message) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    setTimeout(() => {
      errorContainer.style.display = 'none';
    }, 5000);
  }

  function updateCompass(direction) {
    // Rotate needle: 0° = North, but CSS rotation is clockwise
    // Qibla direction is clockwise from North, so we can use it directly
    compassNeedle.style.transform = `translate(-50%, -100%) rotate(${direction}deg)`;
    
    // Get cardinal direction
    let cardinal = '';
    const deg = direction % 360;
    if (deg >= 337.5 || deg < 22.5) cardinal = 'North';
    else if (deg >= 22.5 && deg < 67.5) cardinal = 'Northeast';
    else if (deg >= 67.5 && deg < 112.5) cardinal = 'East';
    else if (deg >= 112.5 && deg < 157.5) cardinal = 'Southeast';
    else if (deg >= 157.5 && deg < 202.5) cardinal = 'South';
    else if (deg >= 202.5 && deg < 247.5) cardinal = 'Southwest';
    else if (deg >= 247.5 && deg < 292.5) cardinal = 'West';
    else if (deg >= 292.5 && deg < 337.5) cardinal = 'Northwest';
    
    directionText.textContent = `${direction.toFixed(2)}° (${cardinal})`;
  }

  async function fetchQiblaDirection(lat, lng) {
    const url = `${API_BASE_URL}/${lat}/${lng}`;
    
    try {
      loading.style.display = 'block';
      errorContainer.style.display = 'none';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.data?.message || 'Failed to get Qibla direction');
      }
      
      const { direction, latitude, longitude } = data.data;
      coordinatesText.textContent = `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
      updateCompass(direction);
      resultSection.style.display = 'block';
      
    } catch (error) {
      console.error('Error fetching Qibla direction:', error);
      showError('Failed to calculate Qibla direction. Please check coordinates and try again.');
    } finally {
      loading.style.display = 'none';
    }
  }

  function handleManualSubmit() {
    const lat = parseFloat(latitudeInput.value);
    const lng = parseFloat(longitudeInput.value);
    
    if (isNaN(lat) || isNaN(lng)) {
      showError('Please enter valid latitude and longitude coordinates.');
      return;
    }
    
    if (lat < -90 || lat > 90) {
      showError('Latitude must be between -90 and 90.');
      return;
    }
    
    if (lng < -180 || lng > 180) {
      showError('Longitude must be between -180 and 180.');
      return;
    }
    
    fetchQiblaDirection(lat, lng);
  }

  function handleLocationSuccess(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    latitudeInput.value = lat;
    longitudeInput.value = lng;
    fetchQiblaDirection(lat, lng);
  }

  function handleLocationError(error) {
    console.error('Geolocation error:', error);
    let message = 'Unable to get your location.';
    if (error.code === 1) {
      message = 'Please allow location access to use this feature.';
    } else if (error.code === 2) {
      message = 'Location information is unavailable.';
    } else if (error.code === 3) {
      message = 'The request to get your location timed out.';
    }
    showError(message);
    loading.style.display = 'none';
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      showError('Geolocation is not supported by your browser.');
      return;
    }
    
    loading.style.display = 'block';
    navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError, {
      timeout: 10000,
      enableHighAccuracy: true
    });
  }

  // Event listeners
  useLocationBtn.addEventListener('click', useCurrentLocation);
  manualBtn.addEventListener('click', handleManualSubmit);
}
// ======================
// TIMELINE SCROLL TRIGGER
// ======================

if (document.querySelector('.timeline')) {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  function checkTimelineItems() {
    const triggerBottom = window.innerHeight * 0.8;
    
    timelineItems.forEach(item => {
      const itemTop = item.getBoundingClientRect().top;
      
      if (itemTop < triggerBottom) {
        item.classList.add('visible');
      }
    });
  }
  
  // Initial check
  checkTimelineItems();
  
  // Check on scroll
  window.addEventListener('scroll', checkTimelineItems);
  
  // Also check on resize
  window.addEventListener('resize', checkTimelineItems);
}

// ======================
// AUDIO PLAY FUNCTION
// ======================

document.querySelectorAll('.audio-overlay').forEach(overlay => {
  overlay.addEventListener('click', () => {
    const audioUrl = overlay.closest('.timeline-item').dataset.audio || '#';
    if (audioUrl === '#') {
      alert('لا يوجد ملف صوتي متاح لهذا القسم.');
      return;
    }
    
    const audio = new Audio(audioUrl);
    audio.play().catch(e => {
      console.warn('Audio playback failed:', e);
      alert('فشل تشغيل الصوت. قد لا يدعم متصفحك هذا التنسيق.');
    });
  });
});
// Scroll-triggered section reveal for History Page
if (document.querySelector('.section')) {
  const sections = document.querySelectorAll('.section');
  
  function checkSections() {
    const triggerBottom = window.innerHeight * 0.8;
    
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      
      if (sectionTop < triggerBottom) {
        section.classList.add('visible');
      }
    });
  }
  
  // Initial check
  checkSections();
  
  // Check on scroll
  window.addEventListener('scroll', checkSections);
  
  // Also check on resize
  window.addEventListener('resize', checkSections);
}