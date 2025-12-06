/**
 * Button Component
 * Creates reusable button elements with different styles
 */

class Button {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      type: options.type || 'primary', // primary, secondary, outline
      href: options.href || null,
      onClick: options.onClick || null,
      className: options.className || '',
      id: options.id || null,
      ...options
    };
  }

  render() {
    const buttonClasses = `button button-${this.options.type} ${this.options.className}`.trim();
    const buttonId = this.options.id ? `id="${this.options.id}"` : '';
    const ariaLabel = this.options.ariaLabel ? `aria-label="${this.options.ariaLabel}"` : '';
    
    if (this.options.href) {
      return `<a href="${this.options.href}" class="${buttonClasses}" ${buttonId} ${ariaLabel}>${this.text}</a>`;
    }

    const onClickAttr = this.options.onClick ? `onclick="${this.options.onClick}"` : '';
    return `<button class="${buttonClasses}" ${buttonId} ${ariaLabel} ${onClickAttr}>${this.text}</button>`;
  }

  static create(text, options = {}) {
    const button = new Button(text, options);
    return button.render();
  }

  static createElement(text, options = {}) {
    const button = new Button(text, options);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = button.render();
    return tempDiv.firstElementChild;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Button;
}

