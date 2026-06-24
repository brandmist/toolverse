const fs = require('fs');
const path = require('path');

const files = [
  'src/components/ui/CSSTools.tsx',
  'src/components/ui/NewCodingTools.tsx',
  'src/components/ui/NewUtilityTools.tsx',
  'src/components/ui/SocialTools.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Standardize inputs/selects: rounded-lg to rounded-xl, p-2 or p-2.5 to p-3
  content = content.replace(/rounded-lg(?=.*?(input|select|textarea))/g, 'rounded-xl');
  content = content.replace(/p-2\.5/g, 'p-3');
  content = content.replace(/p-2(?=\s)/g, 'p-3'); // careful with p-20
  
  // Standardize backgrounds
  content = content.replace(/bg-gray-50/g, 'bg-[#F9FAFB]');
  content = content.replace(/border-gray-200/g, 'border-[#E5E7EB]');
  
  // Standardize buttons (py-4 to py-3 if it's the main black button)
  content = content.replace(/py-4(?=.*hover:bg-\[\#374151\])/g, 'py-3');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Swept', file);
});
