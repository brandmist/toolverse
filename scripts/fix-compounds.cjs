const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const itemPath = path.join(dir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      processDir(itemPath);
    } else if (itemPath.endsWith('.tsx') || itemPath.endsWith('.ts')) {
      let content = fs.readFileSync(itemPath, 'utf8');
      
      content = content.replace(/text-text-(text-)+/g, 'text-text-');
      content = content.replace(/border-border-(border-)+/g, 'border-border-');
      
      content = content.replace(/text-text-text-primary/g, 'text-text-primary'); 
      content = content.replace(/text-text-text-muted/g, 'text-text-muted');
      content = content.replace(/border border border-/g, 'border border-');
      content = content.replace(/bg-card border border-border hover:bg-card border border-border/g, 'bg-card border border-border hover:bg-card-hover');
      
      fs.writeFileSync(itemPath, content, 'utf8');
    }
  }
}

processDir(path.resolve(__dirname, '../src'));
console.log('Fixed compound classes in src');
