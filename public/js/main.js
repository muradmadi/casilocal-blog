/**
 * Main JavaScript Entry Point
 * Initializes all components and handles page-specific logic
 */

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Navbar
  if (document.getElementById('navbar-container')) {
    const navbar = new Navbar('navbar-container');
    navbar.render();
  }

  // Initialize Footer
  if (document.getElementById('footer-container')) {
    const footer = new Footer('footer-container');
    footer.render();
  }

  // Initialize Feather icons after components are rendered
  if (typeof feather !== 'undefined') {
    // Small delay to ensure navbar is rendered
    setTimeout(() => {
      feather.replace();
    }, 100);
  }

  // Page-specific logic
  const currentPage = window.location.pathname;

  // Blog listing page logic
  if (currentPage.includes('/blog/index.html')) {
    initBlogListing();
    initBlogSearch();
  }

  // Contact form logic
  if (currentPage.includes('/contact.html')) {
    initContactForm();
  }
});

/**
 * Initialize blog listing page
 */
function initBlogListing() {
  // Get category from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');

  if (category) {
    // Filter blog cards by category
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
      const cardCategory = card.dataset.category;
      if (cardCategory !== category) {
        card.style.display = 'none';
      }
    });

    // Update page title or show filter message
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle) {
      sectionTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Posts`;
    }
  }
}

/**
 * Initialize blog search functionality
 */
function initBlogSearch() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');

  if (searchQuery) {
    const searchTerm = searchQuery.toLowerCase();
    const blogCards = document.querySelectorAll('.blog-card');
    let visibleCount = 0;

    blogCards.forEach(card => {
      const title = card.querySelector('.blog-card-title')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.blog-card-excerpt')?.textContent.toLowerCase() || '';
      const category = card.querySelector('.blog-card-category')?.textContent.toLowerCase() || '';

      if (title.includes(searchTerm) || excerpt.includes(searchTerm) || category.includes(searchTerm)) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update page title to show search results
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle) {
      sectionTitle.textContent = `Search Results for "${searchQuery}"`;
      if (visibleCount === 0) {
        const blogGrid = document.querySelector('.blog-grid');
        if (blogGrid) {
          const noResults = document.createElement('p');
          noResults.style.cssText = 'text-align: center; color: var(--text-light); grid-column: 1 / -1; padding: 3rem;';
          noResults.textContent = `No posts found matching "${searchQuery}". Try a different search term.`;
          blogGrid.appendChild(noResults);
        }
      }
    }
  }
}

/**
 * Initialize contact form
 */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) {
    return;
  }

  // Create error message container
  let errorContainer = document.getElementById('form-error-message');
  if (!errorContainer) {
    errorContainer = document.createElement('div');
    errorContainer.id = 'form-error-message';
    errorContainer.className = 'form-error-message';
    errorContainer.style.display = 'none';
    contactForm.insertBefore(errorContainer, contactForm.firstChild);
  }

  // Create success message container
  let successContainer = document.getElementById('form-success-message');
  if (!successContainer) {
    successContainer = document.createElement('div');
    successContainer.id = 'form-success-message';
    successContainer.className = 'form-success-message';
    successContainer.style.display = 'none';
    contactForm.insertBefore(successContainer, contactForm.firstChild);
  }

  // Helper function to show error
  function showError(message) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    successContainer.style.display = 'none';
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Helper function to show success
  function showSuccess(message) {
    successContainer.textContent = message;
    successContainer.style.display = 'block';
    errorContainer.style.display = 'none';
    successContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Helper function to validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    try {
      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Clear previous messages
      errorContainer.style.display = 'none';
      successContainer.style.display = 'none';

      // Validation
      if (!data.name || data.name.trim().length === 0) {
        showError('Please enter your name');
        return;
      }

      if (!data.email || data.email.trim().length === 0) {
        showError('Please enter your email address');
        return;
      }

      if (!isValidEmail(data.email)) {
        showError('Please enter a valid email address');
        return;
      }

      if (!data.subject || data.subject.trim().length === 0) {
        showError('Please enter a subject');
        return;
      }

      if (!data.message || data.message.trim().length === 0) {
        showError('Please enter your message');
        return;
      }

      // In a real application, you would send this data to a server
      console.log('Form submitted:', data);
      
      // Simulate async submission
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      // Simulate network delay
      setTimeout(() => {
        showSuccess('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }, 1000);

    } catch (error) {
      console.error('Form submission error:', error);
      showError('An error occurred. Please try again later.');
    }
  });
}

