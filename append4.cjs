const fs = require('fs');
const file = 'src/components/ui/SocialTools.tsx';

const appendCode = `
// Meta Tag & OpenGraph Generator
export function MetaTagGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const generateMeta = () => {
    let output = \`<!-- Standard Meta Tags -->\\n\`;
    if (title) output += \`<title>\${title}</title>\\n\`;
    if (description) output += \`<meta name="description" content="\${description}">\\n\`;
    if (keywords) output += \`<meta name="keywords" content="\${keywords}">\\n\`;
    if (author) output += \`<meta name="author" content="\${author}">\\n\`;

    output += \`\\n<!-- Open Graph / Facebook -->\\n\`;
    output += \`<meta property="og:type" content="website">\\n\`;
    if (url) output += \`<meta property="og:url" content="\${url}">\\n\`;
    if (title) output += \`<meta property="og:title" content="\${title}">\\n\`;
    if (description) output += \`<meta property="og:description" content="\${description}">\\n\`;
    if (imageUrl) output += \`<meta property="og:image" content="\${imageUrl}">\\n\`;

    output += \`\\n<!-- Twitter -->\\n\`;
    output += \`<meta property="twitter:card" content="summary_large_image">\\n\`;
    if (url) output += \`<meta property="twitter:url" content="\${url}">\\n\`;
    if (title) output += \`<meta property="twitter:title" content="\${title}">\\n\`;
    if (description) output += \`<meta property="twitter:description" content="\${description}">\\n\`;
    if (imageUrl) output += \`<meta property="twitter:image" content="\${imageUrl}">\\n\`;

    return output.trim();
  };

  const output = generateMeta();

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Page Title</label>
          <input type="text" className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[14px]" value={title} onChange={e => setTitle(e.target.value)} placeholder="My Awesome Website" />
        </div>
        <div>
          <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Description</label>
          <textarea className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[14px] resize-none h-20" value={description} onChange={e => setDescription(e.target.value)} placeholder="A brief description of the page..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Keywords</label>
            <input type="text" className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[14px]" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="seo, tools, generator" />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Author</label>
            <input type="text" className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[14px]" value={author} onChange={e => setAuthor(e.target.value)} placeholder="John Doe" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Page URL</label>
            <input type="text" className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[14px]" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Image URL (OG/Twitter)</label>
            <input type="text" className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[14px]" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://.../image.jpg" />
          </div>
        </div>
      </div>
      <div className="flex-1 bg-[#111827] rounded-xl p-4 shadow-sm relative group flex flex-col">
         <span className="text-[11px] text-[#9CA3AF] mb-2 block font-semibold uppercase tracking-wider">HTML Output</span>
         <textarea
           readOnly
           value={output}
           className="flex-1 bg-transparent text-[#A7F3D0] font-mono text-[13px] resize-none outline-none border-none p-0"
         />
         <button 
           onClick={copy}
           className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm"
           title="Copy Code"
         >
           {copied ? <Check className="w-4 h-4 text-[#34D399]" /> : <Copy className="w-4 h-4" />}
         </button>
      </div>
    </div>
  );
}
`;

fs.appendFileSync(file, '\n' + appendCode, 'utf8');
console.log('Appended MetaTagGenerator');
