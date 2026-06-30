import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');

const replacements = [
  // Backgrounds
  { regex: /bg-\[#111827\]/g, replacement: 'bg-primary' },
  { regex: /bg-\[#FAFAFA\]/g, replacement: 'bg-surface' },
  { regex: /bg-\[#F9FAFB\]/g, replacement: 'bg-surface' }, // consolidate slightly different grays
  { regex: /bg-\[#F3F4F6\]/g, replacement: 'bg-surface-hover' },
  { regex: /bg-\[#1F2937\]/g, replacement: 'bg-primary-hover' },
  
  // Text
  { regex: /text-\[#111827\]/g, replacement: 'text-primary' },
  { regex: /text-\[#374151\]/g, replacement: 'text-secondary' },
  { regex: /text-\[#6B7280\]/g, replacement: 'text-muted' },
  { regex: /text-\[#4B5563\]/g, replacement: 'text-muted' }, // close to 6B7280
  { regex: /text-\[#9CA3AF\]/g, replacement: 'text-subtle' },
  { regex: /text-\[#EF4444\]/g, replacement: 'text-danger' },
  { regex: /text-\[#10B981\]/g, replacement: 'text-success' },
  { regex: /text-\[#059669\]/g, replacement: 'text-success' },
  { regex: /text-\[#F59E0B\]/g, replacement: 'text-warning' },
  
  // Borders
  { regex: /border-\[#E5E7EB\]/g, replacement: 'border-border' },
  { regex: /border-\[#D1D5DB\]/g, replacement: 'border-border-hover' },
  { regex: /border-\[#BBF7D0\]/g, replacement: 'border-success-border' },
  
  // Hovers
  { regex: /hover:bg-\[#FAFAFA\]/g, replacement: 'hover:bg-surface' },
  { regex: /hover:bg-\[#F9FAFB\]/g, replacement: 'hover:bg-surface' },
  { regex: /hover:bg-\[#F3F4F6\]/g, replacement: 'hover:bg-surface-hover' },
  { regex: /hover:bg-\[#1F2937\]/g, replacement: 'hover:bg-primary-hover' },
  { regex: /hover:text-\[#111827\]/g, replacement: 'hover:text-primary' },
  { regex: /hover:text-\[#374151\]/g, replacement: 'hover:text-secondary' },
  { regex: /hover:border-\[#D1D5DB\]/g, replacement: 'hover:border-border-hover' },
  { regex: /hover:border-\[#111827\]/g, replacement: 'hover:border-primary' },
  
  // Focus
  { regex: /focus:border-\[#111827\]/g, replacement: 'focus:border-primary' },
  { regex: /focus:ring-\[#111827\]/g, replacement: 'focus:ring-primary' },
  
  // Group Hovers
  { regex: /group-hover:text-\[#111827\]/g, replacement: 'group-hover:text-primary' },
  { regex: /group-hover:bg-\[#FAFAFA\]/g, replacement: 'group-hover:bg-surface' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

console.log('Starting global design token standardization...');
processDirectory(SRC_DIR);
console.log('Done!');
