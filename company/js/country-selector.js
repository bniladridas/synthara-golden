/**
 * Simple Country Selection Modal
 */

// Immediately show the modal when the script loads
window.onload = function() {
  console.log('Window loaded, showing modal');

  // Get modal element
  const modal = document.getElementById('country-modal');

  if (!modal) {
    console.error('Modal element not found!');
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
      // Hide the modal
      modal.style.opacity = '0';
      setTimeout(function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }, 400);

      // Show a simple confirmation
      alert('Country selection confirmed! Cache settings enabled.');
    });
  }
};
