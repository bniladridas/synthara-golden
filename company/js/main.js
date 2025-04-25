/**
 * Main JavaScript file for Company Website
 * Minimal functionality to enhance user experience without adding noise
 */

document.addEventListener('DOMContentLoaded', function() {
  // Set active navigation link based on current page
  setActiveNavLink();

  // Initialize smooth scrolling for anchor links
  initSmoothScroll();

  // Initialize image lazy loading
  initLazyLoading();

  // Initialize agent animation if on homepage
  if (window.location.pathname === '/' ||
      window.location.pathname.endsWith('index.html')) {
    initAgentAnimation();
  }
});

/**
 * Set the active navigation link based on the current page
 */
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath.endsWith(linkPath)) {
      link.classList.add('active');
    }
  });

  // If no link is active and we're on the home page
  if (currentPath === '/' || currentPath.endsWith('index.html')) {
    const homeLink = document.querySelector('nav a[href="index.html"]');
    if (homeLink) {
      homeLink.classList.add('active');
    }
  }
}

/**
 * Initialize the agent animation on the homepage
 */
function initAgentAnimation() {
  // We're not using typing animation anymore
  // The CSS animations handle the fade-in effect for a cleaner, more harmonious experience
  // This creates a more elegant, typography-focused animation with no visual noise
}

/**
 * This function is no longer used - we've switched to pure CSS animations
 * for a cleaner, more harmonious visual experience with no noise or redundancy
 */
function typeText(element, text, speed, callback) {
  // Function kept for reference but not used
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
  // Check if the browser supports IntersectionObserver
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src]');

    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}
