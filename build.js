/**
 * Build Script
 * Converts Markdown blog posts to HTML and generates blog listing page
 */

const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');
const { format } = require('date-fns');

// Configure marked for better HTML output
marked.setOptions({
  breaks: true,
  gfm: true
});

// Directories
const CONTENT_DIR = path.join(__dirname, 'content', 'blog');
const PUBLIC_BLOG_DIR = path.join(__dirname, 'public', 'blog');
const PUBLIC_CATEGORY_DIR = path.join(__dirname, 'public', 'blog', 'category');
const TEMPLATES_DIR = path.join(__dirname, 'templates');

/**
 * Read and parse a Markdown file
 */
function parseMarkdownFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  
  return {
    frontmatter: data,
    content: marked.parse(content)
  };
}

/**
 * Generate slug from filename
 */
function generateSlug(filename) {
  return filename.replace(/\.md$/, '').toLowerCase();
}

/**
 * Category name mapping - normalize category names
 */
function normalizeCategory(category) {
  if (!category) return 'general';
  
  const categoryMap = {
    'restaurants': 'restaurants',
    'restaurant': 'restaurants',
    'bars': 'bars & nightlife',
    'bars & nightlife': 'bars & nightlife',
    'bar': 'bars & nightlife',
    'nightlife': 'bars & nightlife',
    'events': 'events',
    'event': 'events',
    'study spots': 'study spots',
    'study-spots': 'study spots',
    'study spot': 'study spots',
    'budget tips': 'budget tips',
    'budget': 'budget tips',
    'budget-tips': 'budget tips',
    'neighborhoods': 'neighborhoods',
    'neighborhood': 'neighborhoods',
    'transportation': 'transportation',
    'transport': 'transportation',
    'culture': 'culture',
    'culture & museums': 'culture',
    'museums': 'culture',
    'museum': 'culture'
  };
  
  const normalized = category.toLowerCase().trim();
  return categoryMap[normalized] || normalized;
}

/**
 * Generate card HTML using Card component structure
 */
function generateCardHTML(post) {
  const slug = post.slug;
  const frontmatter = post.frontmatter;
  const date = frontmatter.date 
    ? format(new Date(frontmatter.date), 'MMMM d, yyyy')
    : format(new Date(), 'MMMM d, yyyy');
  const category = frontmatter.category || 'General';
  const normalizedCategory = normalizeCategory(category);
  const image = frontmatter.image || '';
  const excerpt = frontmatter.excerpt || '';

  return `
      <article class="blog-card" data-category="${normalizedCategory}">
        <a href="/blog/${slug}.html" class="blog-card-link">
          ${image ? `<img src="${image}" alt="${frontmatter.title}" class="blog-card-image">` : ''}
          <div class="blog-card-content">
            <span class="blog-card-category">${category}</span>
            <h3 class="blog-card-title">${frontmatter.title || 'Untitled'}</h3>
            <div class="blog-card-meta">
              <span>By ${frontmatter.author || 'CasiLocal Team'}</span>
              <span>•</span>
              <span>${date}</span>
            </div>
            ${excerpt ? `<p class="blog-card-excerpt">${excerpt}</p>` : ''}
            <span class="button button-primary blog-card-button">Read More</span>
          </div>
        </a>
      </article>
    `;
}

/**
 * Simple template engine
 */
function renderTemplate(template, data) {
  let html = template;
  
  // Replace triple braces {{{variable}}} for unescaped HTML (first, before double braces)
  html = html.replace(/\{\{\{(\w+)\}\}\}/g, (match, key) => {
    return data[key] || '';
  });

  // Replace simple variables {{variable}} (escape HTML)
  html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = data[key] || '';
    if (typeof value === 'string') {
      // Only escape if it's not already HTML (simple check)
      if (value.includes('<') || value.includes('>')) {
        return value; // Already HTML, don't escape
      }
      return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    return value;
  });

  // Replace conditional blocks {{#if variable}}...{{/if}}
  html = html.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, key, content) => {
    return data[key] ? content : '';
  });

  return html;
}

/**
 * Generate individual blog post HTML
 */
function generatePostHTML(post, slug) {
  const templatePath = path.join(TEMPLATES_DIR, 'post.html');
  const template = fs.readFileSync(templatePath, 'utf-8');

  const postData = {
    title: post.frontmatter.title || 'Untitled',
    author: post.frontmatter.author || 'CasiLocal Team',
    date: post.frontmatter.date 
      ? format(new Date(post.frontmatter.date), 'MMMM d, yyyy')
      : format(new Date(), 'MMMM d, yyyy'),
    category: post.frontmatter.category || 'General',
    image: post.frontmatter.image || '',
    excerpt: post.frontmatter.excerpt || '',
    content: post.content
  };

  return renderTemplate(template, postData);
}

/**
 * Generate blog listing page
 */
function generateBlogListing(posts) {
  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((a, b) => {
    const dateA = a.frontmatter.date ? new Date(a.frontmatter.date) : new Date(0);
    const dateB = b.frontmatter.date ? new Date(b.frontmatter.date) : new Date(0);
    return dateB - dateA;
  });

  const postsHTML = sortedPosts.map(post => generateCardHTML(post)).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="CasiLocal Blog - Discover the best restaurants, bars, and events in Madrid">
  <title>Blog - CasiLocal</title>
  
  <!-- Favicons -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  
  <!-- Web App Manifest (PWA) -->
  <link rel="manifest" href="/site.webmanifest">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <div id="navbar-container"></div>

  <main>
    <section class="section" style="padding-top: 4rem;">
      <div class="container">
        <h1 class="section-title">CasiLocal Blog</h1>
        <p style="text-align: center; margin-bottom: 2rem; color: var(--text-light); max-width: 600px; margin-left: auto; margin-right: auto;">
          Discover the best restaurants, bars, events, and hidden gems in Madrid for students.
        </p>
        <div class="blog-grid">
          ${postsHTML || '<p style="text-align: center; color: var(--text-light); grid-column: 1 / -1;">No posts yet. Check back soon!</p>'}
        </div>
      </div>
    </section>
  </main>

  <div id="footer-container"></div>

  <script src="/js/components/button.js"></script>
  <script src="/js/components/navbar.js"></script>
  <script src="/js/components/footer.js"></script>
  <script src="/js/main.js"></script>
</body>
</html>`;
}

/**
 * Generate category page HTML with embedded posts
 */
function generateCategoryPage(categoryName, posts) {
  const categoryInfo = {
    'restaurants': {
      title: 'Where Madrid Eats',
      description: 'From tapas bars to hidden gems, discover the restaurants where locals actually dine. Budget-friendly spots, authentic flavors, and student favorites across the capital.'
    },
    'bars & nightlife': {
      title: 'Madrid After Dark',
      description: 'From rooftop terraces to cozy neighborhood pubs, discover where Madrid comes alive at night. Student-friendly prices, great vibes, and unforgettable nights across the capital.'
    },
    'events': {
      title: "What's Happening",
      description: 'Stay in the loop with Madrid\'s vibrant event scene. From cultural festivals to music concerts, discover the events that make student life in Madrid unforgettable.'
    },
    'study spots': {
      title: 'Where to Focus',
      description: 'Discover Madrid\'s best study spots - from quiet libraries to cozy cafes with perfect WiFi. Find your ideal workspace for acing those exams.'
    },
    'budget tips': {
      title: 'Stretch Your Euros',
      description: 'Live like a local without breaking the bank. Discover student discounts, budget-friendly spots, and insider tips to make the most of your time in Madrid.'
    },
    'neighborhoods': {
      title: 'Know Your Barrios',
      description: 'From Malasaña to Lavapiés, discover Madrid\'s neighborhoods through a student\'s lens. Find the best areas to live, study, and explore.'
    },
    'transportation': {
      title: 'Getting Around',
      description: 'Master Madrid\'s transportation system. From metro passes to bike sharing, learn how to navigate the city efficiently and affordably as a student.'
    },
    'culture': {
      title: 'Art & History',
      description: 'Immerse yourself in Madrid\'s rich cultural scene. From world-class museums to hidden galleries, discover the art, history, and culture that makes Madrid special.'
    }
  };

  const info = categoryInfo[categoryName] || {
    title: categoryName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    description: `Explore ${categoryName} in Madrid.`
  };

  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((a, b) => {
    const dateA = a.frontmatter.date ? new Date(a.frontmatter.date) : new Date(0);
    const dateB = b.frontmatter.date ? new Date(b.frontmatter.date) : new Date(0);
    return dateB - dateA;
  });

  const postsHTML = sortedPosts.map(post => generateCardHTML(post)).join('');

  const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-').replace('&', '');
  const badgeName = categoryName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Discover ${categoryName} in Madrid for students" />
    <title>${badgeName} - CasiLocal</title>

    <!-- Favicons -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

    <!-- Web App Manifest (PWA) -->
    <link rel="manifest" href="/site.webmanifest" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Roboto:wght@300;400;500;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/css/styles.css" />
  </head>
  <body>
    <div id="navbar-container"></div>

    <main>
      <section class="category-hero">
        <div class="container">
          <div class="category-hero-content">
            <span class="category-badge">${badgeName}</span>
            <h1>${info.title}</h1>
            <p class="category-description">
              ${info.description}
            </p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="blog-grid">
            ${postsHTML || '<p style="text-align: center; color: var(--text-light); grid-column: 1 / -1; padding: 3rem;">No posts in this category yet. Check back soon!</p>'}
          </div>
        </div>
      </section>
    </main>

    <div id="footer-container"></div>

    <script src="/js/components/button.js"></script>
    <script src="/js/components/navbar.js"></script>
    <script src="/js/components/footer.js"></script>
    <script src="/js/main.js"></script>
  </body>
</html>`;
}

/**
 * Main build function
 */
async function build() {
  try {
    console.log('Starting build process...');

    // Ensure directories exist
    await fs.ensureDir(CONTENT_DIR);
    await fs.ensureDir(PUBLIC_BLOG_DIR);
    await fs.ensureDir(PUBLIC_CATEGORY_DIR);
    await fs.ensureDir(TEMPLATES_DIR);

    // Read all Markdown files from content/blog
    const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));

    if (files.length === 0) {
      console.log('No Markdown files found in content/blog');
      // Still generate empty blog listing and category pages
      const listingHTML = generateBlogListing([]);
      fs.writeFileSync(path.join(PUBLIC_BLOG_DIR, 'index.html'), listingHTML);
      console.log('Generated empty blog listing page');
      generateEmptyCategoryPages();
      return;
    }

    console.log(`Found ${files.length} blog post(s)`);

    const posts = [];
    const postsByCategory = {};

    // Process each Markdown file
    for (const file of files) {
      const filePath = path.join(CONTENT_DIR, file);
      const slug = generateSlug(file);
      
      console.log(`Processing: ${file} -> ${slug}.html`);

      // Parse Markdown
      const post = parseMarkdownFile(filePath);
      post.slug = slug;

      // Normalize category
      const category = normalizeCategory(post.frontmatter.category || 'General');
      post.normalizedCategory = category;

      // Generate HTML
      const html = generatePostHTML(post, slug);

      // Write HTML file
      const outputPath = path.join(PUBLIC_BLOG_DIR, `${slug}.html`);
      fs.writeFileSync(outputPath, html);

      posts.push(post);

      // Group by category
      if (!postsByCategory[category]) {
        postsByCategory[category] = [];
      }
      postsByCategory[category].push(post);
    }

    // Generate blog listing page
    console.log('Generating blog listing page...');
    const listingHTML = generateBlogListing(posts);
    fs.writeFileSync(path.join(PUBLIC_BLOG_DIR, 'index.html'), listingHTML);

    // Generate category pages
    console.log('Generating category pages...');
    const categoryMap = {
      'restaurants': 'restaurants',
      'bars & nightlife': 'bars',
      'events': 'events',
      'study spots': 'study-spots',
      'budget tips': 'budget',
      'neighborhoods': 'neighborhoods',
      'transportation': 'transportation',
      'culture': 'culture'
    };

    for (const [categoryName, categorySlug] of Object.entries(categoryMap)) {
      const categoryPosts = postsByCategory[categoryName] || [];
      const categoryHTML = generateCategoryPage(categoryName, categoryPosts);
      const categoryPath = path.join(PUBLIC_CATEGORY_DIR, `${categorySlug}.html`);
      fs.writeFileSync(categoryPath, categoryHTML);
      console.log(`  ✓ ${categorySlug}.html (${categoryPosts.length} posts)`);
    }

    console.log('\nBuild completed successfully!');
    console.log(`Generated ${posts.length} blog post(s), 1 listing page, and ${Object.keys(categoryMap).length} category pages`);

  } catch (error) {
    console.error('Build error:', error);
    process.exit(1);
  }
}

/**
 * Generate empty category pages
 */
function generateEmptyCategoryPages() {
  const categoryMap = {
    'restaurants': 'restaurants',
    'bars & nightlife': 'bars',
    'events': 'events',
    'study spots': 'study-spots',
    'budget tips': 'budget',
    'neighborhoods': 'neighborhoods',
    'transportation': 'transportation',
    'culture': 'culture'
  };

  for (const [categoryName, categorySlug] of Object.entries(categoryMap)) {
    const categoryHTML = generateCategoryPage(categoryName, []);
    const categoryPath = path.join(PUBLIC_CATEGORY_DIR, `${categorySlug}.html`);
    fs.writeFileSync(categoryPath, categoryHTML);
  }
  console.log('Generated empty category pages');
}

// Run build
build();

