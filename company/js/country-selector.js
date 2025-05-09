/**
 * Country Selection Modal with Validation
 * Shows only on first visit, respects localStorage
 * Fixed to ensure it only shows once across all pages
 * Enhanced with accessibility features
 */

// Use DOMContentLoaded instead of window.onload for better reliability
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, checking if modal should be shown');

  // Debug localStorage
  try {
    console.log('Current localStorage state:');
    console.log('- selectedCountry:', localStorage.getItem('selectedCountry'));
    console.log('- cacheEnabled:', localStorage.getItem('cacheEnabled'));
  } catch (e) {
    console.error('Error accessing localStorage:', e);
  }

  // Get modal element
  const modal = document.getElementById('country-modal');
  const countrySelect = document.getElementById('country-select');
  const enableCacheCheckbox = document.getElementById('enable-cache');
  const confirmButton = document.getElementById('confirm-country');

  if (!modal || !countrySelect) {
    console.error('Required elements not found!');
    return;
  }

  // Check if user has already selected a country - use a more robust check
  // This will work across all pages including index.html
  const hasSelectedCountry = localStorage.getItem('selectedCountry');
  console.log('Has selected country?', hasSelectedCountry ? 'YES' : 'NO');
  console.log('Current URL:', window.location.href);

  // Only show modal if user hasn't selected a country yet
  if (!hasSelectedCountry) {
    console.log('No country selection found in localStorage, showing modal');

    // Show the modal with a slight delay for better user experience
    setTimeout(() => {
      // Show the modal
      modal.style.display = 'flex';
      modal.style.opacity = '1';
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Get the modal content
      const modalContent = modal.querySelector('.country-modal-content');
      if (modalContent) {
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'translateY(0) scale(1)';
      }

      // Focus the first focusable element in the modal
      countrySelect.focus();

      // Trap focus within modal
      trapFocusInModal(modal);
    }, 300);
  } else {
    console.log('Country already selected:', hasSelectedCountry, '- not showing modal');
    // Ensure modal is hidden
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  // Add event listener to the confirm button
  if (confirmButton) {
    confirmButton.addEventListener('click', function() {
      // Validate country selection
      if (!countrySelect.value) {
        // Show error - add red border to select
        countrySelect.style.borderColor = 'var(--color-error)';
        countrySelect.setAttribute('aria-invalid', 'true');

        // Add shake animation for better feedback
        countrySelect.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        setTimeout(() => {
          countrySelect.style.animation = '';
        }, 500);

        // Announce error to screen readers
        const errorMessage = document.createElement('div');
        errorMessage.className = 'sr-only';
        errorMessage.setAttribute('aria-live', 'assertive');
        errorMessage.textContent = 'Please select a country before continuing.';
        modal.appendChild(errorMessage);

        // Remove error message after it's been announced
        setTimeout(() => {
          modal.removeChild(errorMessage);
        }, 3000);

        // Focus the select element
        countrySelect.focus();

        return; // Stop execution if no country selected
      }

      // Get selected country and cache setting
      const selectedCountry = countrySelect.value;
      const cacheEnabled = enableCacheCheckbox.checked;

      // Store in localStorage
      localStorage.setItem('selectedCountry', selectedCountry);
      localStorage.setItem('cacheEnabled', cacheEnabled ? 'true' : 'false');

      // Hide the modal
      modal.style.opacity = '0';
      modal.setAttribute('aria-hidden', 'true');
      setTimeout(function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';

        // Start the agent animation after the modal is hidden
        startAgentAnimation();
      }, 400);

      // Show confirmation with country name
      const countryName = getCountryName(selectedCountry);

      // Use a more accessible confirmation method
      const confirmationMessage = document.createElement('div');
      confirmationMessage.className = 'sr-only';
      confirmationMessage.setAttribute('aria-live', 'polite');
      confirmationMessage.textContent = `Country selection confirmed: ${countryName}! Cache settings ${cacheEnabled ? 'enabled' : 'disabled'}.`;
      document.body.appendChild(confirmationMessage);

      // Remove confirmation message after it's been announced
      setTimeout(() => {
        document.body.removeChild(confirmationMessage);
      }, 3000);
    });
  }

  // Add event listener to select for validation
  countrySelect.addEventListener('change', function() {
    // Remove error state when user selects a country
    if (this.value) {
      this.style.borderColor = '';
      this.setAttribute('aria-invalid', 'false');
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      // Don't close if this is the first visit - force a selection
      if (!hasSelectedCountry) {
        // Focus the select element
        countrySelect.focus();
        return;
      }

      // Otherwise close the modal
      modal.style.opacity = '0';
      modal.setAttribute('aria-hidden', 'true');
      setTimeout(function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }, 400);
    }
  });

  // Add shake animation style
  addShakeAnimation();
});

/**
 * Trap focus within the modal dialog for keyboard accessibility
 * @param {HTMLElement} modal - The modal element
 */
function trapFocusInModal(modal) {
  // Get all focusable elements
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // Handle tab key to trap focus
  modal.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      // Shift + Tab on first element should loop to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // Tab on last element should loop to first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

/**
 * Get country name from country code
 * @param {string} code - The country code
 * @returns {string} The country name
 */
function getCountryName(code) {
  const countries = {
    'us': 'United States',
    'ca': 'Canada',
    'uk': 'United Kingdom',
    'au': 'Australia',
    'de': 'Germany',
    'fr': 'France',
    'jp': 'Japan',
    'in': 'India',
    'br': 'Brazil',
    'other': 'Somewhere Else Entirely'
  };

  return countries[code] || 'Unknown';
}

/**
 * Add shake animation style to the document
 */
function addShakeAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      10%, 90% { transform: translateX(-1px); }
      20%, 80% { transform: translateX(2px); }
      30%, 50%, 70% { transform: translateX(-3px); }
      40%, 60% { transform: translateX(3px); }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Start the agent animation by adding animation classes
 */
function startAgentAnimation() {
  // Only run on the homepage
  if (window.location.pathname === '/' ||
      window.location.pathname.endsWith('index.html')) {

    // Add animation classes to each element
    const agentPrompt = document.querySelector('.agent-prompt');
    const agentResponse = document.querySelector('.agent-response');
    const agentResponse2 = document.querySelector('.agent-response-2');
    const agentResponse3 = document.querySelector('.agent-response-3');

    if (agentPrompt) agentPrompt.classList.add('animate-prompt');
    if (agentResponse) agentResponse.classList.add('animate-response');
    if (agentResponse2) agentResponse2.classList.add('animate-response-2');
    if (agentResponse3) agentResponse3.classList.add('animate-response-3');
  }
}

// If user has already selected a country, start the animation immediately
document.addEventListener('DOMContentLoaded', function() {
  const hasSelectedCountry = localStorage.getItem('selectedCountry');
  if (hasSelectedCountry) {
    // Small delay to ensure the page is fully loaded
    setTimeout(startAgentAnimation, 500);
  }
});

// Add a hidden debug function to reset country selection (for testing)
// Can be called from console: resetCountrySelection()
window.resetCountrySelection = function() {
  localStorage.removeItem('selectedCountry');
  localStorage.removeItem('cacheEnabled');
  alert('Country selection reset. Refresh the page to see the modal again.');
};
