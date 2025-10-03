// frontend/scripts/main.js
// Main JavaScript loader - using the original complete Script.js

// Import the original complete Script.js file
import './Script.js';

// Import dropdown functionality fix
import './dropdown-fix.js';

// Initialize page loading animation
document.addEventListener('DOMContentLoaded', () => {
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
});