/**
 * Navbar Component
 * Creates and manages the navigation bar
 */

class Navbar {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = {
      brand: options.brand || "CasiLocal",
      links: options.links || [
        { text: "Home", href: "/index.html" },
        {
          text: "Blog",
          href: "/blog/index.html",
          dropdown: [
            { text: "Restaurants", href: "/blog/category/restaurants.html" },
            { text: "Bars & Nightlife", href: "/blog/category/bars.html" },
            { text: "Events", href: "/blog/category/events.html" },
            { text: "Study Spots", href: "/blog/category/study-spots.html" },
            { text: "Budget Tips", href: "/blog/category/budget.html" },
            {
              text: "Neighborhoods",
              href: "/blog/category/neighborhoods.html",
            },
            {
              text: "Transportation",
              href: "/blog/category/transportation.html",
            },
            { text: "Culture & Museums", href: "/blog/category/culture.html" },
          ],
        },
        { text: "About", href: "/about.html" },
      ],
      contactHref: options.contactHref || "/contact.html",
      ...options,
    };
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container with id "${this.containerId}" not found`);
      return;
    }

    const currentPath = window.location.pathname;

    const linksHTML = this.options.links
      .map((link) => {
        const isActive = currentPath.includes(link.href.replace(".html", ""));
        const classes = isActive ? "active" : "";

        if (link.dropdown) {
          const dropdownItems = link.dropdown
            .map((item) => {
              const isItemActive = currentPath.includes(
                item.href.replace(".html", "")
              );
              return `
            <li><a href="${item.href}" class="${
                isItemActive ? "active" : ""
              }">${item.text}</a></li>
          `;
            })
            .join("");

          return `
          <li class="navbar-dropdown">
            <a href="${link.href}" class="${classes}">${link.text} <span class="dropdown-arrow">▼</span></a>
            <ul class="dropdown-menu">
              ${dropdownItems}
            </ul>
          </li>
        `;
        }

        return `
        <li>
          <a href="${link.href}" class="${classes}">${link.text}</a>
        </li>
      `;
      })
      .join("");

    // Use Button component for contact button
    const contactButton = Button.create("Contact", {
      type: "primary",
      href: this.options.contactHref,
      className: "navbar-contact-button",
    });

    container.innerHTML = `
      <nav class="navbar">
        <div class="container">
          <div class="navbar-content">
            <div class="navbar-section navbar-section-logo">
              <a href="/index.html" class="navbar-brand">
                <img src="/assets/images/logo.png" alt="${this.options.brand}" class="navbar-logo">
              </a>
            </div>
            <div class="navbar-section navbar-section-links">
              <ul class="navbar-links">
                ${linksHTML}
              </ul>
            </div>
            <div class="navbar-section navbar-section-contact">
              ${contactButton}
            </div>
          </div>
        </div>
      </nav>
    `;

    // Add dropdown functionality
    const dropdowns = container.querySelectorAll(".navbar-dropdown");
    dropdowns.forEach((dropdown) => {
      const link = dropdown.querySelector("a");
      const menu = dropdown.querySelector(".dropdown-menu");

      link.addEventListener("click", (e) => {
        // Only prevent default if clicking the arrow or the link itself (not a dropdown item)
        if (
          e.target.classList.contains("dropdown-arrow") ||
          e.target === link
        ) {
          e.preventDefault();
          dropdown.classList.toggle("open");
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove("open");
        }
      });

      // Close dropdown when clicking a dropdown item
      const dropdownItems = menu.querySelectorAll("a");
      dropdownItems.forEach((item) => {
        item.addEventListener("click", () => {
          dropdown.classList.remove("open");
        });
      });
    });

    // Active link styling is handled in CSS
  }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = Navbar;
}
