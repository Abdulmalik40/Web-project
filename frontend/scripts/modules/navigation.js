// frontend/scripts/modules/navigation.js
class NavigationManager {
    constructor() {
      this.header = document.getElementById('header');
      this.init();
    }
  
    init() {
      this.setupSmoothScroll();
      this.setupActiveNavItem();
    }
  
    setupSmoothScroll() {
      // Smooth scroll for navigation links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute('href'));
          if (target) {
            const headerHeight = this.header ? this.header.offsetHeight : 0;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  
    setupActiveNavItem() {
      // Navigation active state
      const sections = document.querySelectorAll('section[id]');
      const navItems = document.querySelectorAll('.nav .item a');
      
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - (this.header ? this.header.offsetHeight : 0) - 100;
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
  
    setActiveNavItem() {
      this.setupActiveNavItem();
    }
  }
  
  // Initialize navigation
  document.addEventListener('DOMContentLoaded', () => {
    const navigationManager = new NavigationManager();
    
    // Update active nav item on scroll
    window.addEventListener('scroll', () => {
      navigationManager.setActiveNavItem();
    });
  });