const fs = require('fs');
const content = fs.readFileSync('src/components/ui/NewUtilityTools.tsx', 'utf8');
const newComponent = `
export function SitemapGenerator() {
  const [baseUrl, setBaseUrl] = useState('https://example.com');
  const [modifiedDate, setModifiedDate] = useState(new Date().toISOString().split('T')[0]);
  const [changeFreq, setChangeFreq] = useState('daily');
  const [priority, setPriority] = useState('0.8');
  const [additionalUrls, setAdditionalUrls] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useMemo(() => {
    const urls = [baseUrl, ...additionalUrls.split('\\n').map(u => u.trim()).filter(Boolean)];
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls.map(url => {
        let entry = '  <url>\\n';
        entry += \`    <loc>\${url}</loc>\\n\`;
        if (modifiedDate) entry += \`    <lastmod>\${modifiedDate}</lastmod>\\n\`;
        if (changeFreq) entry += \`    <changefreq>\${changeFreq}</changefreq>\\n\`;
        if (priority) entry += \`    <priority>\${priority}</priority>\\n\`;
        entry += '  </url>';
        return entry;
      }),
      '</urlset>'
    ].join('\\n');
    setOutput(xml);
  }, [baseUrl, modifiedDate, changeFreq, priority, additionalUrls]);

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
      <div className="flex-1 flex flex-col gap-6 max-h-[800px] overflow-y-auto pr-2">
        <div>
          <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Base URL</label>
          <input
            type="url"
            value={baseUrl}
            onChange={e => setBaseUrl(e.target.value)}
            className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] focus:outline-none focus:ring-1 focus:ring-text-primary text-[14px]"
            placeholder="https://example.com"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Last Modified</label>
            <input
              type="date"
              value={modifiedDate}
              onChange={e => setModifiedDate(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] focus:outline-none focus:ring-1 focus:ring-text-primary text-[14px]"
            />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Change Frequency</label>
            <select
              value={changeFreq}
              onChange={e => setChangeFreq(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] focus:outline-none focus:ring-1 focus:ring-text-primary text-[14px] appearance-none cursor-pointer"
            >
              <option value="">None</option>
              <option value="always">Always</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="never">Never</option>
            </select>
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Priority (0.0 - 1.0)</label>
            <input
              type="number"
              min="0.0"
              max="1.0"
              step="0.1"
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] focus:outline-none focus:ring-1 focus:ring-text-primary text-[14px]"
            />
          </div>
        </div>
        <div>
          <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Additional URLs (One per line)</label>
          <textarea
            value={additionalUrls}
            onChange={e => setAdditionalUrls(e.target.value)}
            className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] focus:outline-none focus:ring-1 focus:ring-text-primary min-h-[150px] text-[14px]"
            placeholder="https://example.com/about\nhttps://example.com/contact"
          />
        </div>
      </div>
      <div className="flex-1 bg-[#111827] rounded-xl p-4 shadow-sm relative group flex flex-col min-h-[400px]">
         <span className="text-[11px] text-[#9CA3AF] mb-2 block font-semibold uppercase tracking-wider">sitemap.xml Output</span>
         <textarea
           readOnly
           value={output}
           className="flex-1 bg-transparent text-[#A7F3D0] font-mono text-[13px] resize-none outline-none border-none p-0"
         />
         <button 
           onClick={copy}
           className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors backdrop-blur-sm"
           title="Copy"
         >
           {copied ? <Check className="w-4 h-4 text-[#34D399]" /> : <Copy className="w-4 h-4" />}
         </button>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/ui/NewUtilityTools.tsx', content + newComponent);
console.log('Appended SitemapGenerator');
