import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Using a basic import assuming this script is run via `npx tsx`
const TOOLS = [
  { id: 'case-converter', lastmod: new Date().toISOString() },
  { id: 'password-generator', lastmod: new Date().toISOString() },
  { id: 'remove-background', lastmod: new Date().toISOString() },
  { id: 'pdf-to-jpg', lastmod: new Date().toISOString() },
  // Adding a few sample tools for the script.
  // In a real build, we would import the TOOLS array directly, but since we are running this in a node context without transpile setup, we can read the tools.ts file or hardcode the core routes.
];

const STATIC_ROUTES = [
  '/',
  '/tools',
  '/categories',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/cookie',
  '/blog',
];

async function generateSeoFiles() {
  const domain = 'https://smartools.pages.dev';
  
  // Try to read tools dynamically if possible, but fallback to static routes
  let allUrls = [...STATIC_ROUTES];
  try {
    const toolsData = fs.readFileSync(path.join(process.cwd(), 'src/data/tools.ts'), 'utf-8');
    const toolIds = [...toolsData.matchAll(/id:\s*'([^']+)'/g)].map(m => `/tool/${m[1]}`);
    const catIds = [...toolsData.matchAll(/id:\s*'([^']+)'/g)].filter(m => !toolIds.includes(`/tool/${m[1]}`)).map(m => `/category/${m[1]}`); // basic extraction
    
    // De-dupe and filter
    const uniqueToolIds = [...new Set(toolIds)];
    allUrls = [...allUrls, ...uniqueToolIds];
  } catch (e) {
    console.error("Could not parse tools.ts dynamically, proceeding with basic routes.");
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map(url => `
  <url>
    <loc>${domain}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${url === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${url === '/' ? '1.0' : url.includes('/tool/') ? '0.8' : '0.6'}</priority>
  </url>`).join('')}
</urlset>`;

  const robots = `User-agent: *
Allow: /

Sitemap: ${domain}/sitemap.xml`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'robots.txt'), robots);
  
  console.log('✅ Generated sitemap.xml with ' + allUrls.length + ' URLs');
  console.log('✅ Generated robots.txt');
}

generateSeoFiles();
