/**
 * Card Component
 * Creates reusable blog post cards with consistent styling
 */

class Card {
  constructor(data, options = {}) {
    this.data = {
      title: data.title || 'Untitled',
      slug: data.slug || '',
      category: data.category || 'General',
      author: data.author || 'CasiLocal Team',
      date: data.date || new Date().toLocaleDateString(),
      image: data.image || '',
      excerpt: data.excerpt || '',
      ...data
    };
    this.options = {
      showButton: options.showButton !== false,
      buttonText: options.buttonText || 'Read More',
      buttonType: options.buttonType || 'primary',
      ...options
    };
  }

  render() {
    const imageHTML = this.data.image 
      ? `<img src="${this.data.image}" alt="${this.data.title}" class="blog-card-image">`
      : '';

    const buttonHTML = this.options.showButton
      ? `<a href="/blog/${this.data.slug}.html" class="button button-${this.options.buttonType}">${this.options.buttonText}</a>`
      : '';

    return `
      <article class="blog-card" data-category="${this.data.category.toLowerCase()}">
        ${imageHTML}
        <div class="blog-card-content">
          <span class="blog-card-category">${this.data.category}</span>
          <h3 class="blog-card-title">
            <a href="/blog/${this.data.slug}.html">${this.data.title}</a>
          </h3>
          <div class="blog-card-meta">
            <span>By ${this.data.author}</span>
            <span>•</span>
            <span>${this.data.date}</span>
          </div>
          ${this.data.excerpt ? `<p class="blog-card-excerpt">${this.data.excerpt}</p>` : ''}
          ${buttonHTML}
        </div>
      </article>
    `;
  }

  static create(data, options = {}) {
    const card = new Card(data, options);
    return card.render();
  }

  static createElement(data, options = {}) {
    const card = new Card(data, options);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = card.render();
    return tempDiv.firstElementChild;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Card;
}

