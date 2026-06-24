const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src', 'components', 'ui');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Convert old standard inputs to new style
  content = content.replace(/className="w-full bg-\[\#F9FAFB\] border border-\[\#E5E7EB\] rounded-lg px-4 py-3 text-\[\#111827\] focus:outline-none focus:ring-2 focus:ring-indigo-500\/50 transition-colors"/g, 'className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] focus:outline-none focus:ring-1 focus:ring-text-primary"');
  content = content.replace(/className="w-full bg-\[\#F9FAFB\] border border-\[\#E5E7EB\] rounded-lg px-3 py-2 text-\[\#111827\] focus:outline-none focus:ring-2 focus:ring-indigo-500\/50 transition-colors"/g, 'className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl px-4 py-2 text-[#111827] focus:outline-none focus:ring-1 focus:ring-text-primary"');

  // 2. Button replacements (primary blue -> dark premium)
  content = content.replace(/bg-blue-600 hover:bg-blue-700 text-white/g, 'bg-button-primary text-button-primary-text hover:opacity-90');
  content = content.replace(/bg-indigo-600 hover:bg-indigo-700 text-white/g, 'bg-button-primary text-button-primary-text hover:opacity-90');
  content = content.replace(/bg-\[\#4F46E5\] hover:bg-\[\#4338CA\] text-white/g, 'bg-button-primary text-button-primary-text hover:opacity-90');
  
  // 3. Rounding
  content = content.replace(/rounded-lg/g, 'rounded-xl');
  content = content.replace(/bg-white border border-\[\#E5E7EB\] rounded-xl p-6 shadow-sm/g, 'bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm');
  content = content.replace(/bg-white border border-\[\#E5E7EB\] rounded-xl p-8 shadow-sm/g, 'bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm');
  
  // 4. Input backgrounds
  content = content.replace(/bg-\[\#F9FAFB\]/g, 'bg-[#FAFAFA]');
  
  // 5. Indigo ring removal
  content = content.replace(/focus:ring-2 focus:ring-indigo-500\/50/g, 'focus:ring-1 focus:ring-text-primary');
  content = content.replace(/focus:ring-indigo-500/g, 'focus:ring-text-primary');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
}

fs.readdirSync(uiDir).forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    processFile(path.join(uiDir, file));
  }
});
