const fs = require('fs');
const file = 'src/components/ui/NewUtilityTools.tsx';

const appendCode = `
import * as bcrypt from 'bcryptjs';

// Bcrypt Hash Generator
export function BcryptGenerator() {
  const [input, setInput] = useState('');
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateHash = () => {
    if (!input) return;
    setIsHashing(true);
    // Use setTimeout to allow UI to update loading state
    setTimeout(() => {
      try {
        const salt = bcrypt.genSaltSync(rounds);
        const generatedHash = bcrypt.hashSync(input, salt);
        setHash(generatedHash);
      } catch (e) {
        setHash('Error generating hash');
      }
      setIsHashing(false);
    }, 100);
  };

  const copy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm max-w-2xl mx-auto w-full">
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-semibold text-[#111827] mb-2 block">String to Hash</label>
          <input
            type="text"
            className="w-full p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="my_super_secret_password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-[#111827]">Salt Rounds: {rounds}</label>
            <span className="text-xs text-[#6B7280]">Higher = Slower/More Secure</span>
          </div>
          <input
            type="range"
            min="4"
            max="15"
            value={rounds}
            onChange={(e) => setRounds(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        <button
          onClick={generateHash}
          disabled={!input || isHashing}
          className="w-full bg-[#111827] text-white py-4 rounded-xl font-bold hover:bg-[#374151] transition-colors disabled:opacity-50"
        >
          {isHashing ? 'Hashing...' : 'Generate Bcrypt Hash'}
        </button>
      </div>

      {hash && (
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 relative group">
          <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">Generated Hash</label>
          <code className="text-[#111827] font-mono text-sm break-all">{hash}</code>
          <button 
            onClick={copy}
            className="absolute top-4 right-4 p-2 bg-white border border-[#E5E7EB] rounded-lg shadow-sm hover:bg-[#F3F4F6] transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-[#6B7280]" />}
          </button>
        </div>
      )}
    </div>
  );
}

// Robots.txt Generator
export function RobotsTxtGenerator() {
  const [userAgent, setUserAgent] = useState('*');
  const [allow, setAllow] = useState('/');
  const [disallow, setDisallow] = useState('/admin/, /private/');
  const [sitemap, setSitemap] = useState('https://example.com/sitemap.xml');
  const [delay, setDelay] = useState('');
  const [copied, setCopied] = useState(false);

  const generateRobots = () => {
    let output = \`User-agent: \${userAgent}\\n\`;
    
    if (delay) output += \`Crawl-delay: \${delay}\\n\`;
    
    const disallowRules = disallow.split(',').map(r => r.trim()).filter(Boolean);
    disallowRules.forEach(r => output += \`Disallow: \${r}\\n\`);
    
    const allowRules = allow.split(',').map(r => r.trim()).filter(Boolean);
    allowRules.forEach(r => output += \`Allow: \${r}\\n\`);
    
    if (sitemap) output += \`\\nSitemap: \${sitemap}\\n\`;
    
    return output.trim();
  };

  const output = generateRobots();

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <label className="text-[13px] font-semibold text-[#374151] mb-1 block">User Agent (Bots)</label>
          <input type="text" className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[14px]" value={userAgent} onChange={e => setUserAgent(e.target.value)} placeholder="*" />
        </div>
        <div>
          <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Disallow Directories (Comma separated)</label>
          <input type="text" className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[14px]" value={disallow} onChange={e => setDisallow(e.target.value)} placeholder="/admin/, /login/" />
        </div>
        <div>
          <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Allow Directories (Comma separated)</label>
          <input type="text" className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[14px]" value={allow} onChange={e => setAllow(e.target.value)} placeholder="/" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Sitemap URL</label>
            <input type="text" className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[14px]" value={sitemap} onChange={e => setSitemap(e.target.value)} placeholder="https://..." />
          </div>
          <div className="w-32">
            <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Crawl Delay</label>
            <input type="number" className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[14px]" value={delay} onChange={e => setDelay(e.target.value)} placeholder="Secs" />
          </div>
        </div>
      </div>
      <div className="flex-1 bg-[#111827] rounded-xl p-4 shadow-sm relative group flex flex-col">
         <span className="text-[11px] text-[#9CA3AF] mb-2 block font-semibold uppercase tracking-wider">robots.txt Preview</span>
         <textarea
           readOnly
           value={output}
           className="flex-1 bg-transparent text-[#A7F3D0] font-mono text-[13px] resize-none outline-none border-none p-0"
         />
         <button 
           onClick={copy}
           className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm"
           title="Copy"
         >
           {copied ? <Check className="w-4 h-4 text-[#34D399]" /> : <Copy className="w-4 h-4" />}
         </button>
      </div>
    </div>
  );
}
`;

fs.appendFileSync(file, '\n' + appendCode, 'utf8');
console.log('Appended BcryptGenerator and RobotsTxtGenerator');
