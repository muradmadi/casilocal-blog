/**
 * Category Loader
 * Loads and filters blog posts by category
 */

function loadCategoryPosts(category) {
  // Try to load from blog index
  fetch("/blog/index.html")
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const blogCards = doc.querySelectorAll('.blog-card[data-category]');
      const container = document.getElementById("category-posts");
      
      if (!container) return;

      const filteredCards = Array.from(blogCards).filter((card) => {
        const cardCategory = card.getAttribute("data-category").toLowerCase();
        const targetCategory = category.toLowerCase();
        // Handle variations like "bars & nightlife" vs "bars"
        return cardCategory === targetCategory || 
               cardCategory.includes(targetCategory) || 
               targetCategory.includes(cardCategory);
      });

      if (filteredCards.length > 0) {
        container.innerHTML = "";
        filteredCards.forEach((card) => {
          container.appendChild(card.cloneNode(true));
        });
      } else {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <p style="font-size: 1.125rem; color: var(--text-light); margin-bottom: 1rem;">
              No posts in this category yet. Check back soon!
            </p>
            <a href="/blog/index.html" class="button button-primary">View All Posts</a>
          </div>
        `;
      }
    })
    .catch((error) => {
      console.error("Error loading category posts:", error);
      const container = document.getElementById("category-posts");
      if (container) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <p style="font-size: 1.125rem; color: var(--text-light); margin-bottom: 1rem;">
              Unable to load posts. Please try again later.
            </p>
            <a href="/blog/index.html" class="button button-primary">View All Posts</a>
          </div>
        `;
      }
    });
}

