/**
 * Country Selection Modal with Validation
 */

// Immediately show the modal when the script loads
window.onload = function() {
  console.log('Window loaded, showing modal');

  // Get modal element
  const modal = document.getElementById('country-modal');
  const countrySelect = document.getElementById('country-select');
  const enableCacheCheckbox = document.getElementById('enable-cache');

  if (!modal || !countrySelect) {
    console.error('Required elements not found!');
    return;
  }

  // Show the modal
  modal.style.display = 'flex';
  modal.style.opacity = '1';
  document.body.style.overflow = 'hidden';

  // Get the modal content
  const modalContent = modal.querySelector('.country-modal-content');
  if (modalContent) {
    modalContent.style.opacity = '1';
    modalContent.style.transform = 'translateY(0) scale(1)';
  }

  // Add event listener to the confirm button
  const confirmButton = document.getElementById('confirm-country');
  if (confirmButton) {
    confirmButton.addEventListener('click', function() {
      // Validate country selection
      if (!countrySelect.value) {
        // Show error - add red border to select
        countrySelect.style.borderColor = '#ff0000';

        // Add shake animation for better feedback
        countrySelect.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        setTimeout(() => {
          countrySelect.style.animation = '';
        }, 500);

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
      setTimeout(function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }, 400);

      // Show confirmation with country name
      const countryName = getCountryName(selectedCountry);
      alert(`Country selection confirmed: ${countryName}! Cache settings ${cacheEnabled ? 'enabled' : 'disabled'}.`);
    });
  }

  // Add event listener to select for validation
  countrySelect.addEventListener('change', function() {
    // Remove error state when user selects a country
    if (this.value) {
      this.style.borderColor = '';
    }
  });

  // Add shake animation style
  addShakeAnimation();
};

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
