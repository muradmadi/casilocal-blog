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
    this.boundHandlers = {};
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
            <div class="navbar-dropdown-wrapper">
              <a href="${link.href}" class="${classes}" aria-label="${link.text}">${link.text}</a>
              <button class="dropdown-toggle" aria-haspopup="true" aria-expanded="false" aria-label="${link.text} menu">
                <span class="dropdown-arrow" aria-hidden="true">▼</span>
              </button>
            </div>
            <ul class="dropdown-menu" role="menu">
              ${dropdownItems}
            </ul>
          </li>
        `;
        }

        return `
        <li>
          <a href="${link.href}" class="${classes}" aria-label="${link.text}">${link.text}</a>
        </li>
      `;
      })
      .join("");

    // Use Button component for contact button
    const contactButton = Button.create("Contact", {
      type: "primary",
      href: this.options.contactHref,
      className: "navbar-contact-button",
      ariaLabel: "Contact us",
    });

    container.innerHTML = `
      <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="container">
          <div class="navbar-content">
            <div class="navbar-section navbar-section-logo">
              <a href="/index.html" class="navbar-brand" aria-label="CasiLocal home">
                <img src="/assets/images/logo.png" alt="${this.options.brand}" class="navbar-logo">
              </a>
            </div>
            <button class="navbar-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="navbar-menu">
              <span class="navbar-toggle-icon">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
              </span>
            </button>
            <div class="navbar-section navbar-section-links">
              <ul class="navbar-links" role="menubar" id="navbar-menu">
                ${linksHTML}
              </ul>
            </div>
            <div class="navbar-section navbar-section-search">
              <button class="navbar-search-toggle" aria-label="Search" aria-expanded="false" aria-controls="navbar-search">
                <i data-feather="search" class="search-icon"></i>
              </button>
              <div class="navbar-search-container" id="navbar-search">
                <form class="navbar-search-form" role="search">
                  <input 
                    type="search" 
                    class="navbar-search-input" 
                    placeholder="Search posts..." 
                    aria-label="Search blog posts"
                    autocomplete="off"
                  >
                  <button type="submit" class="navbar-search-submit" aria-label="Submit search">Search</button>
                </form>
              </div>
            </div>
            <div class="navbar-section navbar-section-contact">
              ${contactButton}
            </div>
          </div>
        </div>
        <div class="navbar-mobile-menu" id="navbar-mobile-menu">
          <ul class="navbar-mobile-links">
            ${linksHTML}
          </ul>
          <div class="navbar-mobile-contact">
            ${contactButton}
          </div>
        </div>
      </nav>
    `;

    // Search functionality
    const searchToggle = container.querySelector(".navbar-search-toggle");
    const searchContainer = container.querySelector(".navbar-search-container");
    const searchForm = container.querySelector(".navbar-search-form");
    const searchInput = container.querySelector(".navbar-search-input");

    if (searchToggle && searchContainer) {
      searchToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = searchContainer.classList.contains("search-open");
        searchContainer.classList.toggle("search-open");
        searchToggle.setAttribute("aria-expanded", !isOpen);
        
        if (!isOpen) {
          setTimeout(() => searchInput.focus(), 100);
        }
      });

      // Close search when clicking outside
      document.addEventListener("click", (e) => {
        if (searchContainer.classList.contains("search-open") && 
            !searchContainer.contains(e.target) && 
            !searchToggle.contains(e.target)) {
          searchContainer.classList.remove("search-open");
          searchToggle.setAttribute("aria-expanded", "false");
        }
      });

      // Handle search form submission
      if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const query = searchInput.value.trim();
          if (query) {
            // Simple client-side search - navigate to blog and filter
            window.location.href = `/blog/index.html?search=${encodeURIComponent(query)}`;
          }
        });
      }

      // Close search on escape
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          searchContainer.classList.remove("search-open");
          searchToggle.setAttribute("aria-expanded", "false");
          searchToggle.focus();
        }
      });
    }

    // Mobile menu toggle functionality
    const mobileMenuToggle = container.querySelector(".navbar-toggle");
    const mobileMenu = container.querySelector("#navbar-mobile-menu");
    const navbar = container.querySelector(".navbar");
    
    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = navbar.classList.contains("mobile-open");
        navbar.classList.toggle("mobile-open");
        mobileMenuToggle.setAttribute("aria-expanded", !isOpen);
        
        // Prevent body scroll when menu is open
        if (!isOpen) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
      });

      // Close mobile menu when clicking outside
      document.addEventListener("click", (e) => {
        if (navbar.classList.contains("mobile-open") && 
            !navbar.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
          navbar.classList.remove("mobile-open");
          mobileMenuToggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      });

      // Close mobile menu when clicking a link
      const mobileLinks = mobileMenu.querySelectorAll("a");
      mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
          navbar.classList.remove("mobile-open");
          mobileMenuToggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });

      // Escape key handled by delegated listener below
    }

    // Add dropdown functionality
    const dropdowns = container.querySelectorAll(".navbar-dropdown");
    dropdowns.forEach((dropdown) => {
      const toggleButton = dropdown.querySelector(".dropdown-toggle");
      const menu = dropdown.querySelector(".dropdown-menu");

      if (toggleButton) {
        toggleButton.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = dropdown.classList.contains("open");
          dropdown.classList.toggle("open");
          toggleButton.setAttribute("aria-expanded", !isOpen);
        });
        
        // Handle keyboard navigation
        toggleButton.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const isOpen = dropdown.classList.contains("open");
            dropdown.classList.toggle("open");
            toggleButton.setAttribute("aria-expanded", !isOpen);
          } else if (e.key === "Escape" && dropdown.classList.contains("open")) {
            dropdown.classList.remove("open");
            toggleButton.setAttribute("aria-expanded", "false");
          }
        });
      }

      // Store dropdown reference for delegated handler
      dropdown._toggleButton = toggleButton;

      // Close dropdown when clicking a dropdown item
      const dropdownItems = menu.querySelectorAll("a");
      dropdownItems.forEach((item, index) => {
        item.setAttribute("role", "menuitem");
        item.setAttribute("tabindex", "-1");
        item.addEventListener("click", () => {
          dropdown.classList.remove("open");
          if (toggleButton) {
            toggleButton.setAttribute("aria-expanded", "false");
          }
        });

        // Arrow key navigation within dropdown
        item.addEventListener("keydown", (e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            const nextItem = dropdownItems[index + 1] || dropdownItems[0];
            nextItem.focus();
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const prevItem = dropdownItems[index - 1] || dropdownItems[dropdownItems.length - 1];
            prevItem.focus();
          } else if (e.key === "Escape") {
            dropdown.classList.remove("open");
            if (toggleButton) {
              toggleButton.setAttribute("aria-expanded", "false");
              toggleButton.focus();
            }
          }
        });
      });

      // Focus first item when dropdown opens
      if (toggleButton) {
        const originalToggleHandler = toggleButton.onclick;
        toggleButton.addEventListener("click", () => {
          setTimeout(() => {
            if (dropdown.classList.contains("open") && dropdownItems.length > 0) {
              dropdownItems[0].setAttribute("tabindex", "0");
              dropdownItems[0].focus();
            }
          }, 100);
        });
      }
    });

    // Arrow key navigation for main nav links
    const navLinks = container.querySelectorAll(".navbar-links > li > a, .navbar-links > li > .navbar-dropdown-wrapper > a");
    navLinks.forEach((link, index) => {
      link.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          const nextLink = navLinks[index + 1] || navLinks[0];
          nextLink.focus();
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          const prevLink = navLinks[index - 1] || navLinks[navLinks.length - 1];
          prevLink.focus();
        }
      });
    });

    // Single delegated event listener for closing dropdowns on outside click
    this.boundHandlers.closeDropdowns = (e) => {
      if (!navbar.contains(e.target)) {
        dropdowns.forEach((dropdown) => {
          dropdown.classList.remove("open");
          if (dropdown._toggleButton) {
            dropdown._toggleButton.setAttribute("aria-expanded", "false");
          }
        });
      }
    };
    document.addEventListener("click", this.boundHandlers.closeDropdowns);

    // Single delegated event listener for escape key
    this.boundHandlers.handleEscape = (e) => {
      if (e.key === "Escape") {
        // Close mobile menu
        if (navbar.classList.contains("mobile-open")) {
          navbar.classList.remove("mobile-open");
          if (mobileMenuToggle) {
            mobileMenuToggle.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
            mobileMenuToggle.focus();
          }
        }
        // Close all dropdowns
        dropdowns.forEach((dropdown) => {
          dropdown.classList.remove("open");
          if (dropdown._toggleButton) {
            dropdown._toggleButton.setAttribute("aria-expanded", "false");
            dropdown._toggleButton.focus();
          }
        });
      }
    };
    document.addEventListener("keydown", this.boundHandlers.handleEscape);

    // Active link styling is handled in CSS
    
    // Initialize Feather icons after navbar is rendered
    if (typeof feather !== 'undefined') {
      setTimeout(() => {
        feather.replace();
      }, 50);
    }
  }

  // Cleanup method for removing event listeners
  destroy() {
    if (this.boundHandlers.closeDropdowns) {
      document.removeEventListener("click", this.boundHandlers.closeDropdowns);
    }
    if (this.boundHandlers.handleEscape) {
      document.removeEventListener("keydown", this.boundHandlers.handleEscape);
    }
  }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = Navbar;
}
