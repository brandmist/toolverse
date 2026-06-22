const fs = require('fs');
const files = [
  'src/components/ui/PdfTools.tsx',
  'src/components/ui/NewPdfTools.tsx',
  'src/components/ui/MorePdfTools.tsx',
  'src/components/ui/ExtraPdfTools.tsx',
  'src/components/ui/ImageToolsExtras.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/pdfjs-dist@\\\/build/g, 'pdfjs-dist@${pdfjs.version}/build');
  fs.writeFileSync(f, content);
});
console.log('Fixed');
