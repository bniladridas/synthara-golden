/**
 * Workspace JavaScript functionality
 * Handles login form validation and submission
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get form elements
  const loginForm = document.querySelector('.login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  if (loginForm) {
    // Add form submission handler
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      let isValid = true;
      
      // Validate email
      if (!validateEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      } else {
        clearError(emailInput);
      }
      
      // Validate password
      if (passwordInput.value.length < 8) {
        showError(passwordInput, 'Password must be at least 8 characters');
        isValid = false;
      } else {
        clearError(passwordInput);
      }
      
      // If form is valid, simulate login
      if (isValid) {
        simulateLogin();
      }
    });
    
    // Add input event listeners for real-time validation
    emailInput.addEventListener('input', function() {
      if (validateEmail(this.value)) {
        clearError(this);
      }
    });
    
    passwordInput.addEventListener('input', function() {
      if (this.value.length >= 8) {
        clearError(this);
      }
    });
  }
});

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Show error message for an input
 * @param {HTMLElement} input - The input element
 * @param {string} message - The error message
 */
function showError(input, message) {
  // Remove any existing error message
  clearError(input);
  
  // Add aria-invalid attribute
  input.setAttribute('aria-invalid', 'true');
  
  // Create error message element
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  errorElement.setAttribute('role', 'alert');
  
  // Insert error message after input
  input.parentNode.insertBefore(errorElement, input.nextSibling);
}

/**
 * Clear error message for an input
 * @param {HTMLElement} input - The input element
 */
function clearError(input) {
  // Remove aria-invalid attribute
  input.removeAttribute('aria-invalid');
  
  // Remove any existing error message
  const errorElement = input.parentNode.querySelector('.error-message');
  if (errorElement) {
    errorElement.parentNode.removeChild(errorElement);
  }
}

/**
 * Simulate login process
 * This is just a demo - in a real application, this would send a request to the server
 */
function simulateLogin() {
  // Get form and submit button
  const loginForm = document.querySelector('.login-form');
  const submitButton = loginForm.querySelector('button[type="submit"]');
  
  // Disable form and show loading indicator
  submitButton.disabled = true;
  const originalButtonText = submitButton.textContent;
  submitButton.innerHTML = '<span class="loading"></span> Signing in...';
  
  // Simulate API request delay
  setTimeout(function() {
    // Create success message
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = 'Login successful! Redirecting to dashboard...';
    successElement.setAttribute('role', 'alert');
    
    // Add success message to form
    loginForm.appendChild(successElement);
    
    // Simulate redirect delay
    setTimeout(function() {
      // In a real application, this would redirect to the dashboard
      alert('This is a demo. In a real application, you would be redirected to your dashboard.');
      
      // Reset form
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      loginForm.reset();
      
      // Remove success message
      successElement.parentNode.removeChild(successElement);
    }, 2000);
  }, 1500);
}
