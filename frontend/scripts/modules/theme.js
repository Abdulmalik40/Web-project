// frontend/scripts/modules/theme.js
class ThemeManager {
    constructor() {
      this.themeToggle = document.getElementById('themeToggle');
      this.body = document.body;
      this.init();
    }
  
    init() {
      // Check for saved theme or default to light
      const savedTheme = localStorage.getItem('theme') || 'light';
      this.body.setAttribute('data-theme', savedTheme);
      this.updateThemeToggle(savedTheme);
  
      // Theme toggle event listener
      if (this.themeToggle) {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
      }
    }
  
    toggleTheme() {
      const currentTheme = this.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Add smooth transition
      this.body.style.transition = 'all 0.3s ease';
      this.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      this.updateThemeToggle(newTheme);
      
      // Remove transition after animation
      setTimeout(() => {
        this.body.style.transition = '';
      }, 300);
    }
  
    updateThemeToggle(theme) {
      if (this.themeToggle) {
        this.themeToggle.innerHTML = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
      }
    }
  }
  
  // Initialize theme manager
  document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
  });