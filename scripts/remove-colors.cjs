const fs = require('fs');
const path = require('path');

const colorNames = [
  'sky', 'indigo', 'purple', 'pink', 'emerald', 'amber', 'cyan', 'rose', 
  'slate', 'blue', 'green', 'red', 'yellow', 'orange', 'teal', 'fuchsia', 'violet', 'gray', 'zinc', 'neutral', 'stone'
];

const colorRegex = new RegExp(`\\b(text|bg|border)-(${colorNames.join('|')})-[1-9]00(\\/\\d+)?\\b`, 'g');

function processDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const itemPath = path.join(dir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      processDir(itemPath);
    } else if (itemPath.endsWith('.tsx') || itemPath.endsWith('.ts')) {
      processFile(itemPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/text-slate-400|text-slate-500|text-gray-400|text-gray-500/g, 'text-text-muted');
  content = content.replace(/bg-slate-800\/50/g, 'bg-card border border-border');
  content = content.replace(/text-white/g, 'text-text-primary'); 
  
  content = content.replace(colorRegex, (match, type, color) => {
    if (type === 'text') {
      if (['emerald', 'green'].includes(color)) return 'text-success';
      if (['rose', 'red'].includes(color)) return 'text-danger';
      if (['amber', 'yellow'].includes(color)) return 'text-warning';
      return 'text-text-primary';
    }
    if (type === 'bg') {
       if (match.includes('/')) return 'bg-surface border border-border';
       return 'bg-card border border-border';
    }
    if (type === 'border') {
       return 'border-border';
    }
    return match;
  });

  content = content.replace(/\bbg-gradient-to-[a-z]+\b|\bfrom-[a-z]+-[1-9]00\b|\bto-[a-z]+-[1-9]00\b|\bvia-[a-z]+-[1-9]00\b/g, '');

  content = content.replace(/\b(text|bg|border)-(primary|accent|secondary|muted)(\/\d+)?\b/g, (match, type, token) => {
    if (type === 'text') {
       if (token === 'muted') return 'text-text-muted';
       if (token === 'primary') return 'text-text-primary';
       if (token === 'secondary') return 'text-text-secondary';
       if (token === 'accent') return 'text-text-secondary';
    }
    if (type === 'bg') {
       if (token === 'primary' && !match.includes('/')) return 'bg-button-primary text-button-primary-text';
       if (match.includes('/')) return 'bg-surface border border-border';
       return 'bg-card border border-border';
    }
    if (type === 'border') {
       return 'border-border';
    }
    return match;
  });
  
  content = content.replace(/className="([^"]+)"/g, (m, c) => `className="${c.replace(/\s+/g, ' ').trim()}"`);
  
  fs.writeFileSync(filePath, content, 'utf8');
}

const targetDir = process.argv[2];
if (targetDir) {
  processDir(path.resolve(targetDir));
  console.log('Successfully processed', targetDir);
} else {
  console.log('Please provide a directory');
}
