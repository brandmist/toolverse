import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS, CATEGORIES } from '../src/data/tools.js';
import { BLOGS } from '../src/data/blogs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://smartools.pages.dev';

function generateSitemap() {
  const urls: string[] = [];
  const addUrl = (loc: string, priority: string = '0.8', changefreq: string = 'weekly') => {
    urls.push(`  <url>
    <loc>${BASE_URL}${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
  };

  // Base routes
  addUrl('/', '1.0', 'daily');
  addUrl('/categories', '0.9', 'weekly');
  addUrl('/search', '0.8', 'monthly');
  addUrl('/tools', '0.9', 'daily');
  addUrl('/blog', '0.9', 'daily');

  // Static Pages
  const staticPages = ['/about', '/contact', '/privacy', '/terms', '/cookie', '/dmca', '/accessibility', '/disclaimer'];
  staticPages.forEach(page => addUrl(page, '0.5', 'monthly'));

  // Categories
  CATEGORIES.forEach(category => {
    addUrl(`/category/${category.id}`, '0.8', 'weekly');
  });

  // Tools
  TOOLS.forEach(tool => {
    addUrl(`/tool/${tool.id}`, '0.9', 'weekly');
  });

  // Blogs
  BLOGS.forEach(blog => {
    addUrl(`/blog/${blog.id}`, '0.7', 'monthly');
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(outputPath, sitemap, 'utf-8');
  
  console.log(`✅ Sitemap generated successfully with ${urls.length} URLs at ${outputPath}`);
}

generateSitemap();
