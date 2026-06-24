const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'src/pages/ToolDetail.tsx');
let content = fs.readFileSync(file, 'utf8');

const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"](\.\.\/components\/ui\/[^'"]+)['"]/g;

let match;
let replacements = [];

while ((match = importRegex.exec(content)) !== null) {
  const fullImport = match[0];
  const components = match[1].split(',').map(s => s.trim()).filter(Boolean);
  const importPath = match[2];

  let lazyStatements = components.map(c => 
    `const ${c} = lazy(() => import('${importPath}').then(m => ({ default: m.${c} })))`
  ).join('\n');

  replacements.push({ original: fullImport, newText: lazyStatements });
}

if (!content.includes('import { Suspense, lazy }') && !content.includes('import { lazy')) {
  if (content.includes("import { useEffect } from 'react'")) {
    content = content.replace("import { useEffect } from 'react'", "import { useEffect, Suspense, lazy } from 'react'");
  } else {
    content = "import { Suspense, lazy } from 'react';\n" + content;
  }
}

for (const rep of replacements) {
  content = content.replace(rep.original, rep.newText);
}

if (!content.includes('<Suspense')) {
  content = content.replace(/\{renderToolInterface\(\)\}/g, '<Suspense fallback={<div className="flex items-center justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>{renderToolInterface()}</Suspense>');
}

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully lazy-loaded ' + replacements.length + ' import statements.');
