// frontend/scripts/modules/animations.js
class AnimationManager {
    constructor() {
      this.init();
    }
  
    init() {
      this.setupCardAnimations();
      this.setupButtonAnimations();
      this.setupScrollReveal();
      this.setupHeroAnimations();
    }
  
    setupCardAnimations() {
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
        card.addEventListener('click', (e) => this.createRippleEffect(e, card));
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
    }
  
    setupButtonAnimations() {
      // Button click animations
      document.querySelectorAll('.explore-btn').forEach(button => {
        button.addEventListener('click', (e) => this.handleButtonClick(e, button));
      });
  
      // Hero CTA buttons enhanced animations
      document.querySelectorAll('.cta-btn').forEach(button => {
        button.addEventListener('click', (e) => this.handleCtaButtonClick(e, button));
      });
    }
  
    setupScrollReveal() {
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
    }
  
    setupHeroAnimations() {
      // Hero text typing effect
      const titleLines = document.querySelectorAll('.title-line');
      titleLines.forEach((line, index) => {
        line.style.animationDelay = `${0.5 + (index * 0.3)}s`;
      });
    }
  
    createRippleEffect(e, element) {
      const ripple = document.createElement('span');
      const rect = element.getBoundingClientRect();
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
      
      element.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }
  
    handleButtonClick(e, button) {
      e.preventDefault();
      
      // Add loading animation
      const originalText = button.innerHTML;
      button.innerHTML = '⟳ Loading...';
      button.style.transform = 'scale(0.98)';
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.transform = 'scale(1)';
        
        // Scroll to regions section
        const regionsSection = document.getElementById('regions');
        if (regionsSection) {
          const header = document.getElementById('header');
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = regionsSection.offsetTop - headerHeight - 100;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }, 1000);
    }
  
    handleCtaButtonClick(e, button) {
      e.preventDefault();
      
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
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
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
        
        // Scroll to content
        if (button.textContent.includes('Journey')) {
          const banner = document.querySelector('.banner');
          if (banner) {
            banner.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }, 600);
    }
  }
  
  // Initialize animations
  document.addEventListener('DOMContentLoaded', () => {
    new AnimationManager();
  });