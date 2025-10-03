// Dropdown functionality fix for Saudi tourism website
document.addEventListener('DOMContentLoaded', () => {
  // Enhanced dropdown functionality
  const dropdowns = document.querySelectorAll('.nav .has-dropdown');
  
  dropdowns.forEach(dropdown => {
    const dropdownMenu = dropdown.querySelector('.dropdown');
    const dropdownLink = dropdown.querySelector('a');
    
    if (dropdownMenu && dropdownLink) {
      let hoverTimeout;
      
      // Show dropdown on hover with delay
      dropdown.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          dropdownMenu.style.display = 'block';
          setTimeout(() => {
            dropdownMenu.style.opacity = '1';
          dropdownMenu.style.transform = 'translateY(0)';
        }, 100);
      });
      
      // Hide dropdown when mouse leaves
      dropdown.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          dropdownMenu.style.opacity = '0';
          dropdownMenu.style.transform = 'translateY(-10px)';
          setTimeout(() => {
            dropdownMenu.style.display = 'none';
          }, 300);
        }, 150);
      });
      
      // Keep dropdown open when hovering over it
      dropdownMenu.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        dropdownMenu.style.display = 'block';
        dropdownMenu.style.opacity = '1';
        dropdownMenu.style.transform = 'translateY(0)';
      });
      
      dropdownMenu.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          dropdownMenu.style.opacity = '0';
          dropdownMenu.style.transform = 'translateY(-10px)';
          setTimeout(() => {
            dropdownMenu.style.display = 'none';
          }, 300);
        }, 150);
      });
      
      // Handle keyboard navigation
      dropdownLink.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const isOpen = dropdownMenu.style.display === 'block' && dropdownMenu.style.opacity === '1';
          if (isOpen) {
            dropdownMenu.style.opacity = '0';
            dropdownMenu.style.transform = 'translateY(-10px)';
            setTimeout(() => {
              dropdownMenu.style.display = 'none';
            }, 300);
          } else {
            dropdownMenu.style.display = 'block';
            setTimeout(() => {
              dropdownMenu.style.opacity = '1';
              dropdownMenu.style.transform = 'translateY(0)';
            }, 10);
          }
        }
      });
    }
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav .has-dropdown')) {
      dropdowns.forEach(dropdown => {
        const dropdownMenu = dropdown.querySelector('.dropdown');
        if (dropdownMenu) {
          dropdownMenu.style.display = 'none';
          dropdownMenu.style.opacity = '0';
          dropdownMenu.style.transform = 'translateY(-10px)';
        }
      });
    }
  });
  
  // Enhanced scroll functionality
  const navLinks = document.querySelectorAll('.nav .item a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Update active navigation on scroll
  const sections = document.querySelectorAll('section[id]');
  
  const updateActiveNav = () => {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all nav links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to current section's nav link
        const activeLink = document.querySelector(`.nav .item a[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  };
  
  // Throttled scroll event
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveNav, 10);
  });
  
  // Initialize active nav on page load
  updateActiveNav();
});
