// frontend/scripts/modules/timeline.js
class TimelineManager {
    constructor() {
      this.init();
    }
  
    init() {
      if (document.querySelector('.timeline')) {
        this.setupTimelineAnimations();
      }
      if (document.querySelector('.section')) {
        this.setupSectionAnimations();
      }
      this.setupAudioOverlays();
    }
  
    setupTimelineAnimations() {
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
  
    setupSectionAnimations() {
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
  
    setupAudioOverlays() {
      document.querySelectorAll('.audio-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
          const audioUrl = overlay.closest('.timeline-item')?.dataset.audio || '#';
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
    }
  }
  
  // Initialize timeline manager
  document.addEventListener('DOMContentLoaded', () => {
    new TimelineManager();
  });