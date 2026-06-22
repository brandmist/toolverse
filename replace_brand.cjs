const fs = require('fs');
const path = require('path');

const directoriesToSearch = ['src', 'public', 'scripts'];
const filesToSearch = ['index.html', 'package.json', 'README.md', 'robots.txt'];
const extensionsToSearch = ['.ts', '.tsx', '.json', '.html', '.md', '.xml', '.txt'];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replacements
  content = content.replace(/ToolVerse/g, 'SmarTools');
  content = content.replace(/toolverse\.com/g, 'smartools.pages.dev');
  content = content.replace(/toolverse/g, 'smartools');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        walkDir(fullPath);
      }
    } else {
      if (extensionsToSearch.some(ext => file.endsWith(ext))) {
        replaceInFile(fullPath);
      }
    }
  }
}

directoriesToSearch.forEach(walkDir);
filesToSearch.forEach(file => {
  if (fs.existsSync(file)) {
    replaceInFile(file);
  }
});
console.log('Done!');
