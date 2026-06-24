const fs = require('fs');
const file = 'src/components/ui/NewUtilityTools.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `// Robots.txt Generator`;
const startIdx = content.indexOf(targetStr);

const before = content.slice(0, startIdx);

const newCode = `// Robots.txt Generator
export function RobotsTxtGenerator() {
  const [userAgent, setUserAgent] = useState('*');
  const [allow, setAllow] = useState('/');
  const [disallow, setDisallow] = useState('');
  const [sitemap, setSitemap] = useState('https://example.com/sitemap.xml');
  const [delay, setDelay] = useState('');
  
  const [reqPreset, setReqPreset] = useState('');
  const [projPreset, setProjPreset] = useState('');
  
  const [bots, setBots] = useState({
    'GPTBot': false,
    'ChatGPT-User': false,
    'Google-Extended': false,
    'PerplexityBot': false,
    'Amazonbot': false,
    'ClaudeBot': false,
    'Omgilibot': false,
    'FacebookBot': false,
    'Applebot': false,
    'anthropic-ai': false,
    'Bytespider': false,
    'Claude-Web': false,
    'Diffbot': false,
    'ImagesiftBot': false,
    'Omgili': false,
    'YouBot': false
  });
  
  const [blockAllBots, setBlockAllBots] = useState(false);
  const [copied, setCopied] = useState(false);

  // Requirements Presets
  const applyReqPreset = (preset: string) => {
    setReqPreset(preset);
    setProjPreset(''); // reset project
    switch(preset) {
      case 'allow-all':
        setUserAgent('*'); setAllow('/'); setDisallow(''); break;
      case 'block-all':
        setUserAgent('*'); setAllow(''); setDisallow('/'); break;
      case 'block-dir':
        setUserAgent('*'); setAllow(''); setDisallow('/private-dir/'); break;
      case 'block-file':
        setUserAgent('*'); setAllow(''); setDisallow('/private-file.html'); break;
      case 'allow-google-only':
        setUserAgent('Googlebot'); setAllow('/'); setDisallow(''); break; // In generation, we will append User-agent: * Disallow: /
      case 'block-params':
        setUserAgent('*'); setAllow(''); setDisallow('/*?*'); break;
      case 'allow-dir-only':
        setUserAgent('*'); setAllow('/public-dir/'); setDisallow('/'); break;
      case 'block-images':
        setUserAgent('Googlebot-Image'); setAllow(''); setDisallow('/images/'); break;
      case 'block-css-js':
        setUserAgent('*'); setAllow(''); setDisallow('/*.css$, /*.js$'); break;
    }
  };

  // Project Presets
  const applyProjPreset = (preset: string) => {
    setProjPreset(preset);
    setReqPreset('');
    setUserAgent('*');
    setAllow('');
    
    switch(preset) {
      case 'wordpress':
        setDisallow('/wp-admin/, /wp-includes/');
        setAllow('/wp-admin/admin-ajax.php');
        break;
      case 'shopify':
        setDisallow('/admin/, /cart/, /orders/, /checkout/, /account/');
        break;
      case 'magento':
        setDisallow('/index.php/, /catalog/product_compare/, /catalog/category/view/, /catalog/product/view/, /catalogsearch/, /checkout/, /control/, /contacts/, /customer/, /customize/, /newsletter/, /poll/, /review/, /sendfriend/, /tag/, /wishlist/');
        break;
      case 'drupal':
        setDisallow('/core/, /profiles/, /README.txt, /web.config, /admin/, /comment/reply/, /filter/tips/, /node/add/, /search/, /user/register/, /user/password/, /user/login/, /user/logout/');
        break;
      case 'joomla':
        setDisallow('/administrator/, /bin/, /cache/, /cli/, /components/, /includes/, /installation/, /language/, /layouts/, /libraries/, /logs/, /modules/, /plugins/, /tmp/');
        break;
      case 'prestashop':
        setDisallow('/classes/, /config/, /download/, /mails/, /modules/, /translations/, /tools/');
        break;
      case 'wix':
        setDisallow('/_api/, /_partials/');
        break;
      case 'bigcommerce':
        setDisallow('/account.php, /cart.php, /checkout.php, /finishorder.php, /login.php, /orderstatus.php, /postreview.php, /productimage.php, /productupdates.php, /remote.php, /search.php, /viewfile.php, /wishlist.php, /admin/');
        break;
      case 'squarespace':
        setDisallow('/config/, /api/');
        break;
      case 'weebly':
        setDisallow('/ajax/');
        break;
      case 'blogger':
        setDisallow('/search');
        break;
    }
  };

  const handleBotChange = (bot: string, checked: boolean) => {
    setBots(prev => ({ ...prev, [bot]: checked }));
    if (!checked) setBlockAllBots(false);
  };

  const handleBlockAllBots = (checked: boolean) => {
    setBlockAllBots(checked);
    const newBots = { ...bots };
    for (const key in newBots) {
      newBots[key as keyof typeof bots] = checked;
    }
    setBots(newBots);
  };

  const generateRobots = () => {
    let output = '';

    // Handle special multi-agent presets first
    if (reqPreset === 'allow-google-only') {
      output += \`User-agent: Googlebot\\nAllow: /\\n\\nUser-agent: *\\nDisallow: /\\n\\n\`;
    } else if (reqPreset === 'block-css-js') {
      output += \`User-agent: *\\nDisallow: /*.css$\\nDisallow: /*.js$\\n\\n\`;
    } else {
      // Normal flow
      output += \`User-agent: \${userAgent}\\n\`;
      
      if (delay) output += \`Crawl-delay: \${delay}\\n\`;
      
      const disallowRules = disallow.split(',').map(r => r.trim()).filter(Boolean);
      disallowRules.forEach(r => output += \`Disallow: \${r}\\n\`);
      
      const allowRules = allow.split(',').map(r => r.trim()).filter(Boolean);
      allowRules.forEach(r => output += \`Allow: \${r}\\n\`);
      
      output += '\\n';
    }

    // AI Bots
    const blockedBots = Object.entries(bots).filter(([_, checked]) => checked).map(([bot]) => bot);
    if (blockedBots.length > 0) {
      blockedBots.forEach(bot => {
        output += \`User-agent: \${bot}\\nDisallow: /\\n\\n\`;
      });
    }

    // Sitemap
    if (sitemap) {
      output += \`Sitemap: \${sitemap}\\n\`;
    }
    
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
      <div className="flex-[1.5] flex flex-col gap-6 max-h-[800px] overflow-y-auto pr-2">
        
        {/* Presets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Based on requirements</label>
            <select value={reqPreset} onChange={(e) => applyReqPreset(e.target.value)} className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[13px] outline-none text-[#111827]">
              <option value="">Select a requirement...</option>
              <option value="allow-all">Allow all robots to access entire site</option>
              <option value="block-all">Block all robots from entire site</option>
              <option value="block-dir">Block a specific directory</option>
              <option value="block-file">Block a specific file</option>
              <option value="allow-google-only">Allow Googlebot, block all others</option>
              <option value="block-params">Block specific URL parameters</option>
              <option value="allow-dir-only">Allow specific directory, block rest</option>
              <option value="block-images">Block images from specific directory</option>
              <option value="block-css-js">Block access to CSS and JS files</option>
            </select>
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Based on project</label>
            <select value={projPreset} onChange={(e) => applyProjPreset(e.target.value)} className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[13px] outline-none text-[#111827]">
              <option value="">Select a project...</option>
              <option value="wordpress">WordPress</option>
              <option value="shopify">Shopify</option>
              <option value="magento">Magento</option>
              <option value="drupal">Drupal</option>
              <option value="joomla">Joomla</option>
              <option value="prestashop">PrestaShop</option>
              <option value="wix">Wix</option>
              <option value="bigcommerce">BigCommerce</option>
              <option value="squarespace">Squarespace</option>
              <option value="weebly">Weebly</option>
              <option value="blogger">Blogger</option>
            </select>
          </div>
        </div>

        {/* Custom Rules */}
        <div className="p-4 rounded-xl border border-[#E5E7EB] bg-white space-y-4">
           <h4 className="text-[13px] font-bold text-[#111827]">Custom Rules</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="text-[12px] font-semibold text-[#6B7280] mb-1 block">User Agent</label>
               <input type="text" className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px]" value={userAgent} onChange={e => setUserAgent(e.target.value)} />
             </div>
             <div>
               <label className="text-[12px] font-semibold text-[#6B7280] mb-1 block">Crawl Delay (Secs)</label>
               <input type="number" className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px]" value={delay} onChange={e => setDelay(e.target.value)} placeholder="e.g. 10" />
             </div>
           </div>
           <div>
             <label className="text-[12px] font-semibold text-[#6B7280] mb-1 block">Disallow (Comma separated)</label>
             <input type="text" className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px]" value={disallow} onChange={e => setDisallow(e.target.value)} />
           </div>
           <div>
             <label className="text-[12px] font-semibold text-[#6B7280] mb-1 block">Allow (Comma separated)</label>
             <input type="text" className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px]" value={allow} onChange={e => setAllow(e.target.value)} />
           </div>
           <div>
             <label className="text-[12px] font-semibold text-[#6B7280] mb-1 block">Sitemap URL</label>
             <input type="text" className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px]" value={sitemap} onChange={e => setSitemap(e.target.value)} />
           </div>
        </div>

        {/* AI Bots Blocking */}
        <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[13px] font-bold text-[#111827]">Block AI Bots</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={blockAllBots} onChange={(e) => handleBlockAllBots(e.target.checked)} className="rounded text-[#111827] focus:ring-[#111827]" />
              <span className="text-[13px] font-semibold text-[#DC2626]">Block All Bots</span>
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.keys(bots).map(bot => (
              <label key={bot} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={bots[bot as keyof typeof bots]} 
                  onChange={(e) => handleBotChange(bot, e.target.checked)} 
                  className="rounded border-[#D1D5DB] text-[#111827] focus:ring-[#111827]"
                />
                <span className="text-[12px] font-medium text-[#374151] truncate" title={bot}>{bot}</span>
              </label>
            ))}
          </div>
        </div>

      </div>

      <div className="flex-1 bg-[#111827] rounded-xl p-4 shadow-sm relative group flex flex-col min-h-[400px]">
         <span className="text-[11px] text-[#9CA3AF] mb-2 block font-semibold uppercase tracking-wider">robots.txt Output</span>
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

fs.writeFileSync(file, before + newCode, 'utf8');
console.log('Replaced RobotsTxtGenerator');
