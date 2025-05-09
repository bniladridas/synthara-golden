/**
 * Changelog Modal Functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Create the changelog button
  const changelogButton = document.createElement('div');
  changelogButton.className = 'changelog-button';
  changelogButton.setAttribute('aria-label', 'View changelog');
  changelogButton.setAttribute('role', 'button');
  changelogButton.setAttribute('tabindex', '0');
  changelogButton.innerHTML = '<img src="/svg/delta.svg" alt="Delta icon">';
  document.body.appendChild(changelogButton);

  // Create the changelog modal
  const changelogModal = document.createElement('div');
  changelogModal.className = 'changelog-modal';
  changelogModal.setAttribute('role', 'dialog');
  changelogModal.setAttribute('aria-modal', 'true');
  changelogModal.setAttribute('aria-labelledby', 'changelog-title');
  
  // Create the modal content
  const changelogContent = document.createElement('div');
  changelogContent.className = 'changelog-content';
  
  // Create the close button
  const closeButton = document.createElement('div');
  closeButton.className = 'changelog-close';
  closeButton.setAttribute('aria-label', 'Close changelog');
  closeButton.setAttribute('role', 'button');
  closeButton.setAttribute('tabindex', '0');
  
  // Create the title
  const title = document.createElement('h2');
  title.id = 'changelog-title';
  title.className = 'changelog-title';
  title.textContent = 'Changelog';
  
  // Create the body
  const body = document.createElement('div');
  body.className = 'changelog-body';
  body.innerHTML = '<p>Loading changelog...</p>';
  
  // Append elements
  changelogContent.appendChild(closeButton);
  changelogContent.appendChild(title);
  changelogContent.appendChild(body);
  changelogModal.appendChild(changelogContent);
  document.body.appendChild(changelogModal);
  
  // Function to fetch and parse the changelog
  function fetchChangelog() {
    fetch('/CHANGELOG.md')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load changelog');
        }
        return response.text();
      })
      .then(markdown => {
        // Simple markdown to HTML conversion
        let html = markdown
          // Convert headers
          .replace(/^# (.*$)/gm, '<h1>$1</h1>')
          .replace(/^## (.*$)/gm, '<h2>$1</h2>')
          .replace(/^### (.*$)/gm, '<h3>$1</h3>')
          // Convert links
          .replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
          // Convert lists
          .replace(/^- (.*$)/gm, '<li>$1</li>')
          .replace(/(<li>.*<\/li>\n)+/gm, '<ul>$&</ul>')
          // Convert paragraphs
          .replace(/^(?!<[uh][1-3]>|<li>|<ul>)(.+)$/gm, '<p>$1</p>');
        
        body.innerHTML = html;
      })
      .catch(error => {
        body.innerHTML = `<p>Error loading changelog: ${error.message}</p>`;
      });
  }
  
  // Event listeners
  changelogButton.addEventListener('click', function() {
    changelogModal.classList.add('show');
    fetchChangelog();
    // Trap focus in modal
    changelogContent.focus();
  });
  
  changelogButton.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      changelogModal.classList.add('show');
      fetchChangelog();
      closeButton.focus();
    }
  });
  
  closeButton.addEventListener('click', function() {
    changelogModal.classList.remove('show');
    changelogButton.focus();
  });
  
  closeButton.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      changelogModal.classList.remove('show');
      changelogButton.focus();
    }
  });
  
  // Close modal when clicking outside content
  changelogModal.addEventListener('click', function(e) {
    if (e.target === changelogModal) {
      changelogModal.classList.remove('show');
      changelogButton.focus();
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && changelogModal.classList.contains('show')) {
      changelogModal.classList.remove('show');
      changelogButton.focus();
    }
  });
});
