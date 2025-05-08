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

  // Initialize page transitions
  initPageTransitions();
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

// Agent animation is now handled in country-selector.js

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

/**
 * Initialize page transitions with blur-to-clarity effect
 */
function initPageTransitions() {
  // Add transition-fade class to main content
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.classList.add('transition-fade');
  }

  // Handle all internal link clicks
  document.addEventListener('click', function(e) {
    // Find closest anchor tag
    const link = e.target.closest('a');

    // If it's an internal link (not external, not anchor, not javascript)
    if (link &&
        link.href.startsWith(window.location.origin) &&
        !link.href.includes('#') &&
        !link.href.startsWith('javascript:') &&
        !link.target) {

      e.preventDefault();

      // Start transition animation
      document.documentElement.classList.add('is-animating');

      // After animation completes, navigate to the new page
      setTimeout(function() {
        window.location.href = link.href;
      }, 400); // Match this to your CSS transition time
    }
  });

  // When page loads, remove the animation class
  window.addEventListener('pageshow', function() {
    document.documentElement.classList.remove('is-animating');
  });
}
