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

  // Page-specific logic
  const currentPage = window.location.pathname;

  // Blog listing page logic
  if (currentPage.includes('/blog/index.html')) {
    initBlogListing();
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
 * Initialize contact form
 */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Simple validation
      if (!data.name || !data.email || !data.message) {
        alert('Please fill in all fields');
        return;
      }

      // In a real application, you would send this data to a server
      console.log('Form submitted:', data);
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
    });
  }
}

