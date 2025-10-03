// frontend/scripts/modules/quranApi.js
class QuranAPI {
    constructor() {
      this.API_BASE_URL = 'https://www.mp3quran.net/api/v3/reciters';
      this.recitersData = [];
      this.init();
    }
  
    init() {
      if (document.querySelector('.quran-container')) {
        this.setupEventListeners();
        this.fetchReciters();
      }
    }
  
    setupEventListeners() {
      const languageSelect = document.getElementById('languageSelect');
      const reciterSelect = document.getElementById('reciterSelect');
      const surahSelect = document.getElementById('surahSelect');
      const loadBtn = document.getElementById('loadBtn');
  
      if (languageSelect) {
        languageSelect.addEventListener('change', () => this.fetchReciters());
      }
      if (reciterSelect) {
        reciterSelect.addEventListener('change', () => this.populateSurahs());
      }
      if (surahSelect) {
        surahSelect.addEventListener('change', () => this.updateLoadButton());
      }
      if (loadBtn) {
        loadBtn.addEventListener('click', () => this.loadAudio());
      }
    }
  
    async fetchReciters() {
      const languageSelect = document.getElementById('languageSelect');
      const reciterSelect = document.getElementById('reciterSelect');
      const surahSelect = document.getElementById('surahSelect');
      const loadBtn = document.getElementById('loadBtn');
      const errorContainer = document.getElementById('errorContainer');
      const loading = document.getElementById('loading');
  
      const language = languageSelect ? languageSelect.value : 'en';
      const url = `${this.API_BASE_URL}?language=${language}`;
      
      try {
        if (loading) loading.style.display = 'block';
        if (errorContainer) errorContainer.style.display = 'none';
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        this.recitersData = data.reciters || [];
        
        if (reciterSelect) {
          reciterSelect.innerHTML = '<option value="">Select a reciter</option>';
          this.recitersData.forEach(reciter => {
            const option = document.createElement('option');
            option.value = reciter.id;
            option.textContent = reciter.name;
            reciterSelect.appendChild(option);
          });
          
          reciterSelect.disabled = false;
        }
        
        if (surahSelect) {
          surahSelect.disabled = true;
          surahSelect.innerHTML = '<option value="">Select a reciter first</option>';
        }
        if (loadBtn) loadBtn.disabled = true;
        
      } catch (error) {
        console.error('Error fetching reciters:', error);
        if (errorContainer) {
          errorContainer.textContent = 'Failed to load reciters. Please try again later.';
          errorContainer.style.display = 'block';
        }
      } finally {
        if (loading) loading.style.display = 'none';
      }
    }
  
    populateSurahs() {
      const reciterSelect = document.getElementById('reciterSelect');
      const surahSelect = document.getElementById('surahSelect');
      const loadBtn = document.getElementById('loadBtn');
  
      const reciterId = reciterSelect ? reciterSelect.value : '';
      if (!reciterId) {
        if (surahSelect) {
          surahSelect.disabled = true;
          surahSelect.innerHTML = '<option value="">Select a reciter first</option>';
        }
        if (loadBtn) loadBtn.disabled = true;
        return;
      }
  
      const reciter = this.recitersData.find(r => r.id == reciterId);
      if (!reciter || !reciter.moshaf || reciter.moshaf.length === 0) {
        if (surahSelect) {
          surahSelect.disabled = true;
          surahSelect.innerHTML = '<option value="">No surahs available</option>';
        }
        if (loadBtn) loadBtn.disabled = true;
        return;
      }
  
      const surahList = reciter.moshaf[0].surah_list.split(',').map(Number);
      if (surahSelect) {
        surahSelect.innerHTML = '<option value="">Select a surah</option>';
        
        surahList.forEach(surahNum => {
          const option = document.createElement('option');
          option.value = surahNum;
          const language = document.getElementById('languageSelect')?.value || 'en';
          const surahName = this.getSurahName(surahNum, language);
          option.textContent = `${surahNum}. ${surahName}`;
          surahSelect.appendChild(option);
        });
  
        surahSelect.disabled = false;
      }
  
      if (loadBtn) {
        loadBtn.disabled = !(reciterSelect?.value && surahSelect?.value);
      }
    }
  
    updateLoadButton() {
      const reciterSelect = document.getElementById('reciterSelect');
      const surahSelect = document.getElementById('surahSelect');
      const loadBtn = document.getElementById('loadBtn');
  
      if (loadBtn) {
        loadBtn.disabled = !(reciterSelect?.value && surahSelect?.value);
      }
    }
  
    loadAudio() {
      const reciterSelect = document.getElementById('reciterSelect');
      const surahSelect = document.getElementById('surahSelect');
      const errorContainer = document.getElementById('errorContainer');
      const playerSection = document.getElementById('playerSection');
      const audioPlayer = document.getElementById('audioPlayer');
      const currentReciter = document.getElementById('currentReciter');
      const currentSurah = document.getElementById('currentSurah');
  
      const reciterId = reciterSelect ? reciterSelect.value : '';
      const surahId = surahSelect ? surahSelect.value : '';
      
      if (!reciterId || !surahId) {
        if (errorContainer) {
          errorContainer.textContent = 'Please select both a reciter and a surah.';
          errorContainer.style.display = 'block';
        }
        return;
      }
  
      const reciter = this.recitersData.find(r => r.id == reciterId);
      if (!reciter || !reciter.moshaf || reciter.moshaf.length === 0) {
        if (errorContainer) {
          errorContainer.textContent = 'Selected reciter has no available recordings.';
          errorContainer.style.display = 'block';
        }
        return;
      }
  
      const serverUrl = reciter.moshaf[0].server.trim();
      const audioUrl = `${serverUrl}${String(surahId).padStart(3, '0')}.mp3`;
      
      if (currentReciter) currentReciter.textContent = reciter.name;
      if (currentSurah) {
        const language = document.getElementById('languageSelect')?.value || 'en';
        const surahName = this.getSurahName(surahId, language);
        currentSurah.textContent = `${surahId}. ${surahName}`;
      }
      
      if (audioPlayer) {
        audioPlayer.src = audioUrl;
        audioPlayer.style.display = 'block';
      }
      if (playerSection) playerSection.style.display = 'block';
      
      if (audioPlayer) {
        audioPlayer.play().catch(e => console.warn('Auto-play failed:', e));
      }
    }
  
    getSurahName(surahNum, language) {
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
  
      return language === 'ar' ? arabicSurahNames[surahNum] : englishSurahNames[surahNum];
    }
  }
  
  // Initialize Quran API
  document.addEventListener('DOMContentLoaded', () => {
    new QuranAPI();
  });