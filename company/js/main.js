/**
 * Main JavaScript file for Company Website
 * Minimal functionality to enhance user experience without adding noise
 * Enhanced with accessibility features
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

  // Initialize keyboard navigation
  initKeyboardNavigation();

  // Initialize focus visibility
  initFocusVisibility();
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

/**
 * Initialize keyboard navigation for dropdown menus and interactive elements
 */
function initKeyboardNavigation() {
  // Handle dropdown menu keyboard navigation
  const moreButton = document.querySelector('.more-button');
  const dropdownMenu = document.querySelector('.nav-dropdown');

  if (moreButton && dropdownMenu) {
    // Convert div to button for better accessibility if not already
    if (moreButton.tagName !== 'BUTTON') {
      const newButton = document.createElement('button');
      newButton.className = moreButton.className;
      newButton.innerHTML = moreButton.innerHTML;
      newButton.setAttribute('aria-expanded', 'false');
      newButton.setAttribute('aria-controls', 'dropdown-menu');
      moreButton.parentNode.replaceChild(newButton, moreButton);
      moreButton = newButton;
    }

    // Toggle dropdown with keyboard
    moreButton.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !expanded);

      if (!expanded) {
        // If opening the dropdown, focus the first item
        setTimeout(() => {
          const firstLink = dropdownMenu.querySelector('a');
          if (firstLink) firstLink.focus();
        }, 100);
      }
    });

    // Close dropdown when pressing Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && moreButton.getAttribute('aria-expanded') === 'true') {
        moreButton.setAttribute('aria-expanded', 'false');
        moreButton.focus();
      }
    });

    // Handle arrow key navigation within dropdown
    dropdownMenu.addEventListener('keydown', function(e) {
      const links = Array.from(this.querySelectorAll('a'));
      const currentIndex = links.indexOf(document.activeElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % links.length;
        links[nextIndex].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + links.length) % links.length;
        links[prevIndex].focus();
      } else if (e.key === 'Tab' && e.shiftKey && currentIndex === 0) {
        // If tabbing backwards from first item, close dropdown and focus button
        e.preventDefault();
        moreButton.setAttribute('aria-expanded', 'false');
        moreButton.focus();
      } else if (e.key === 'Tab' && !e.shiftKey && currentIndex === links.length - 1) {
        // If tabbing forward from last item, close dropdown
        moreButton.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/**
 * Initialize focus visibility to only show focus styles when using keyboard
 */
function initFocusVisibility() {
  // Add class to body to indicate JS is enabled
  document.body.classList.add('js-focus-visible');

  // Track whether user is using keyboard or mouse
  let usingKeyboard = false;

  // Set to true when user presses Tab
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      usingKeyboard = true;
      document.body.classList.add('user-is-tabbing');
    }
  });

  // Set to false when user clicks with mouse
  document.addEventListener('mousedown', function() {
    usingKeyboard = false;
    document.body.classList.remove('user-is-tabbing');
  });

  // Add focus-visible class to elements when focused with keyboard
  document.addEventListener('focusin', function(e) {
    if (usingKeyboard) {
      e.target.classList.add('focus-visible');
    }
  });

  // Remove focus-visible class when focus moves away
  document.addEventListener('focusout', function(e) {
    e.target.classList.remove('focus-visible');
  });
}
