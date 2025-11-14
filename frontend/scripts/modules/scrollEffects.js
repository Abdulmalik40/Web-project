// frontend/scripts/modules/scrollEffects.js
class ScrollEffects {
    constructor() {
      this.header = document.getElementById('header');
      this.scrollIndicator = document.querySelector('.scroll-indicator');
      this.init();
    }
  
    init() {
      window.addEventListener('scroll', () => this.handleScroll());
    }
  
    handleScroll() {
      const scrollY = window.scrollY;
      
      // Header scroll effect
      if (this.header) {
        if (scrollY > 100) {
          this.header.classList.add('scrolled');
        } else {
          this.header.classList.remove('scrolled');
        }
      }
      
      // Hide scroll indicator when user starts scrolling
      if (this.scrollIndicator) {
        if (scrollY > 50) {
          this.scrollIndicator.classList.add('hidden');
        } else {
          this.scrollIndicator.classList.remove('hidden');
        }
      }
      
      // Update parallax
      this.updateParallax(scrollY);
    }
  
    updateParallax(scrollY) {
      const heroImage = document.querySelector('.hero-image');
      const heroContent = document.querySelector('.hero-content');
      const heroParticles = document.querySelectorAll('.particle');
      
      if (heroImage) {
        heroImage.style.transform = `scale(1.1) translateY(${scrollY * 0.3}px)`;
      }
      
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.1}px)`;
        heroContent.style.opacity = Math.max(0, 1 - scrollY / 600);
      }
      
      // Animate particles with different speeds
      heroParticles.forEach((particle, index) => {
        const speed = 0.2 + (index * 0.1);
        particle.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }
  }
  
  // Initialize scroll effects
  document.addEventListener('DOMContentLoaded', () => {
    new ScrollEffects();
  });