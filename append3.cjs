const fs = require('fs');
const file = 'src/components/ui/CSSTools.tsx';

const appendCode = `
// CSS Animation Generator
export function CssAnimationGenerator() {
  const [animationType, setAnimationType] = useState('bounce');
  const [duration, setDuration] = useState(1);
  const [delay, setDelay] = useState(0);
  const [iteration, setIteration] = useState('infinite');
  const [timing, setTiming] = useState('ease-in-out');
  const [copied, setCopied] = useState(false);

  const animations = {
    bounce: \`@keyframes bounce {
  0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
  50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
}\`,
    pulse: \`@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .5; transform: scale(1.05); }
}\`,
    spin: \`@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}\`,
    ping: \`@keyframes ping {
  75%, 100% { transform: scale(2); opacity: 0; }
}\`,
    shake: \`@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}\`
  };

  const cssClass = \`.animate-\${animationType} {
  animation: \${animationType} \${duration}s \${timing} \${delay}s \${iteration};
}\`;

  const fullCss = \`\${animations[animationType as keyof typeof animations]}\\n\\n\${cssClass}\`;

  // We inject the keyframes dynamically into the document head so the preview works
  useEffect(() => {
    const styleId = 'custom-animation-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = fullCss;
  }, [fullCss]);

  const copy = () => {
    navigator.clipboard.writeText(fullCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-5">
          <div>
            <label className="text-[13px] font-semibold text-[#374151] mb-2 block">Animation Type</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(animations).map(type => (
                <button
                  key={type}
                  onClick={() => setAnimationType(type)}
                  className={\`py-2 rounded-lg text-[13px] font-semibold capitalize transition-all \${animationType === type ? 'bg-[#111827] text-white shadow-sm' : 'bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827]'}\`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Duration ({duration}s)</label>
              <input type="range" min="0.1" max="5" step="0.1" value={duration} onChange={e => setDuration(parseFloat(e.target.value))} className="w-full accent-[#111827]" />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Delay ({delay}s)</label>
              <input type="range" min="0" max="5" step="0.1" value={delay} onChange={e => setDelay(parseFloat(e.target.value))} className="w-full accent-[#111827]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Iterations</label>
              <select value={iteration} onChange={e => setIteration(e.target.value)} className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px] outline-none">
                <option value="infinite">Infinite</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#374151] mb-1 block">Timing</label>
              <select value={timing} onChange={e => setTiming(e.target.value)} className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px] outline-none">
                <option value="ease">ease</option>
                <option value="linear">linear</option>
                <option value="ease-in">ease-in</option>
                <option value="ease-out">ease-out</option>
                <option value="ease-in-out">ease-in-out</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex-1 bg-gradient-to-br from-[#10B981] to-[#3B82F6] rounded-2xl flex items-center justify-center p-8 min-h-[250px] relative overflow-hidden">
             {/* Dotted pattern */}
             <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
             
             <div className={\`w-24 h-24 bg-white rounded-xl shadow-2xl animate-\${animationType}\`}></div>
          </div>
          
          <div className="bg-[#111827] rounded-xl p-4 shadow-sm relative group min-h-[140px]">
             <span className="text-[11px] text-[#9CA3AF] mb-2 block font-semibold uppercase tracking-wider">CSS Code</span>
             <textarea readOnly value={fullCss} className="w-full h-[120px] bg-transparent text-[#A7F3D0] font-mono text-[13px] resize-none outline-none border-none p-0 pr-8" />
             <button onClick={copy} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm" title="Copy">
               {copied ? <Check className="w-4 h-4 text-[#34D399]" /> : <Copy className="w-4 h-4" />}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.appendFileSync(file, '\n' + appendCode, 'utf8');
console.log('Appended CssAnimationGenerator');
