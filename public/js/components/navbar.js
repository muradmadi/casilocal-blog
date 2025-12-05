/**
 * Navbar Component
 * Creates and manages the navigation bar
 */

class Navbar {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = {
      brand: options.brand || 'CasiLocal',
      links: options.links || [
        { text: 'Home', href: '/index.html' },
        { text: 'Blog', href: '/blog/index.html' },
        { text: 'About', href: '/about.html' },
        { text: 'Contact', href: '/contact.html' }
      ],
      ...options
    };
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container with id "${this.containerId}" not found`);
      return;
    }

    const currentPath = window.location.pathname;
    
    const linksHTML = this.options.links.map(link => {
      const isActive = currentPath.includes(link.href.replace('.html', ''));
      return `
        <li>
          <a href="${link.href}" ${isActive ? 'class="active"' : ''}>${link.text}</a>
        </li>
      `;
    }).join('');

    container.innerHTML = `
      <nav class="navbar">
        <div class="container">
          <div class="navbar-content">
            <a href="/index.html" class="navbar-brand">${this.options.brand}</a>
            <ul class="navbar-links">
              ${linksHTML}
            </ul>
          </div>
        </div>
      </nav>
    `;

    // Add active link styling
    const style = document.createElement('style');
    style.textContent = `
      .navbar-links a.active {
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
      }
    `;
    document.head.appendChild(style);
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navbar;
}

