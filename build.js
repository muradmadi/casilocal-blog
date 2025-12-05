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
 * Simple template engine
 */
function renderTemplate(template, data) {
  let html = template;
  
  // Replace simple variables {{variable}}
  html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || '';
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

  const postsHTML = sortedPosts.map(post => {
    const slug = post.slug;
    const frontmatter = post.frontmatter;
    const date = frontmatter.date 
      ? format(new Date(frontmatter.date), 'MMMM d, yyyy')
      : format(new Date(), 'MMMM d, yyyy');
    const category = frontmatter.category || 'General';
    const image = frontmatter.image || '';
    const excerpt = frontmatter.excerpt || '';

    return `
      <article class="blog-card" data-category="${category.toLowerCase()}">
        ${image ? `<img src="${image}" alt="${frontmatter.title}" class="blog-card-image">` : ''}
        <div class="blog-card-content">
          <span class="blog-card-category">${category}</span>
          <h3 class="blog-card-title">
            <a href="/blog/${slug}.html">${frontmatter.title || 'Untitled'}</a>
          </h3>
          <div class="blog-card-meta">
            <span>By ${frontmatter.author || 'CasiLocal Team'}</span>
            <span>•</span>
            <span>${date}</span>
          </div>
          ${excerpt ? `<p class="blog-card-excerpt">${excerpt}</p>` : ''}
          <a href="/blog/${slug}.html" class="button button-outline">Read More</a>
        </div>
      </article>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="CasiLocal Blog - Discover the best restaurants, bars, and events in Madrid">
  <title>Blog - CasiLocal</title>
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
          ${postsHTML || '<p style="text-align: center; color: var(--text-light);">No posts yet. Check back soon!</p>'}
        </div>
      </div>
    </section>
  </main>

  <div id="footer-container"></div>

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
    await fs.ensureDir(TEMPLATES_DIR);

    // Read all Markdown files from content/blog
    const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));

    if (files.length === 0) {
      console.log('No Markdown files found in content/blog');
      // Still generate empty blog listing
      const listingHTML = generateBlogListing([]);
      fs.writeFileSync(path.join(PUBLIC_BLOG_DIR, 'index.html'), listingHTML);
      console.log('Generated empty blog listing page');
      return;
    }

    console.log(`Found ${files.length} blog post(s)`);

    const posts = [];

    // Process each Markdown file
    for (const file of files) {
      const filePath = path.join(CONTENT_DIR, file);
      const slug = generateSlug(file);
      
      console.log(`Processing: ${file} -> ${slug}.html`);

      // Parse Markdown
      const post = parseMarkdownFile(filePath);
      post.slug = slug;

      // Generate HTML
      const html = generatePostHTML(post, slug);

      // Write HTML file
      const outputPath = path.join(PUBLIC_BLOG_DIR, `${slug}.html`);
      fs.writeFileSync(outputPath, html);

      posts.push(post);
    }

    // Generate blog listing page
    console.log('Generating blog listing page...');
    const listingHTML = generateBlogListing(posts);
    fs.writeFileSync(path.join(PUBLIC_BLOG_DIR, 'index.html'), listingHTML);

    console.log('Build completed successfully!');
    console.log(`Generated ${posts.length} blog post(s) and 1 listing page`);

  } catch (error) {
    console.error('Build error:', error);
    process.exit(1);
  }
}

// Run build
build();

