/**
 * Footer Component
 * Creates and manages the footer
 */

class Footer {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = {
      year: new Date().getFullYear(),
      links: options.links || {
        quickLinks: [
          { text: 'Home', href: '/index.html' },
          { text: 'Blog', href: '/blog/index.html' },
          { text: 'About', href: '/about.html' },
          { text: 'Contact', href: '/contact.html' }
        ],
        categories: [
          { text: 'Restaurants', href: '/blog/index.html?category=restaurants' },
          { text: 'Bars', href: '/blog/index.html?category=bars' },
          { text: 'Events', href: '/blog/index.html?category=events' }
        ]
      },
      social: options.social || [],
      ...options
    };
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container with id "${this.containerId}" not found`);
      return;
    }

    const quickLinksHTML = this.options.links.quickLinks.map(link => 
      `<li><a href="${link.href}">${link.text}</a></li>`
    ).join('');

    const categoriesHTML = this.options.links.categories.map(link => 
      `<li><a href="${link.href}">${link.text}</a></li>`
    ).join('');

    const socialHTML = this.options.social.length > 0 ? `
      <div class="footer-section">
        <h3>Follow Us</h3>
        <ul>
          ${this.options.social.map(social => 
            `<li><a href="${social.href}" target="_blank" rel="noopener noreferrer">${social.text}</a></li>`
          ).join('')}
        </ul>
      </div>
    ` : '';

    container.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <h3>CasiLocal</h3>
              <p>Your guide to the best restaurants, bars, and events in Madrid for students.</p>
            </div>
            <div class="footer-section">
              <h3>Quick Links</h3>
              <ul>
                ${quickLinksHTML}
              </ul>
            </div>
            <div class="footer-section">
              <h3>Categories</h3>
              <ul>
                ${categoriesHTML}
              </ul>
            </div>
            ${socialHTML}
          </div>
          <div class="footer-bottom">
            <p>&copy; ${this.options.year} CasiLocal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Footer;
}

