# CasiLocal Blog

A Madrid-based blog website for students, providing information about restaurants, bars, events, and more. Built with legacy web technologies: plain HTML, CSS, and JavaScript.

## Features

- Static HTML pages (Home, About, Contact)
- Blog system with Markdown content
- Responsive design with plain CSS
- Reusable JavaScript components (Navbar, Footer, Buttons)
- Build script to convert Markdown to HTML

## Project Structure

```
/
├── public/              # Static website files
│   ├── index.html      # Homepage
│   ├── about.html      # About page
│   ├── contact.html    # Contact page
│   ├── blog/           # Blog posts (generated)
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   └── assets/         # Images and media
├── content/            # Markdown blog posts
│   └── blog/
├── templates/          # HTML templates for blog posts
└── build.js            # Build script
```

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

### Creating Blog Posts

1. Create a new Markdown file in `content/blog/` with the following frontmatter:

```markdown
---
title: "Your Post Title"
date: 2024-01-15
author: "Author Name"
category: "Restaurants" | "Bars" | "Events" | "General"
image: "/assets/images/your-image.jpg"
excerpt: "A brief description of your post"
---

Your blog post content in Markdown...
```

2. Run the build script:
```bash
npm run build
```

This will:
- Convert all Markdown files to HTML
- Generate individual blog post pages
- Update the blog listing page

### Serving the Website

You can serve the `public/` folder using any static file server:

- **Python**: `python -m http.server 8000` (then visit http://localhost:8000)
- **Node.js**: Use `http-server` or `serve` package
- **VS Code**: Use the "Live Server" extension

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Plain CSS with custom properties (no frameworks)
- **JavaScript (ES6+)**: Vanilla JS for components
- **Node.js**: Build script for Markdown conversion
- **Marked**: Markdown to HTML converter
- **Gray Matter**: Frontmatter parser

## Components

### Navbar
- Responsive navigation bar
- Active link highlighting
- Sticky positioning

### Footer
- Multi-column layout
- Quick links and categories
- Social media links (optional)

### Buttons
- Primary, secondary, and outline styles
- Reusable button component

## Blog Categories

- **Restaurants**: Dining recommendations and reviews
- **Bars**: Bar guides and nightlife tips
- **Events**: Cultural events and activities
- **General**: Other student-related content

## License

ISC

