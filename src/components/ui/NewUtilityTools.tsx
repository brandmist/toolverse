import { useState, useMemo } from 'react'
import { Button } from './button'
import { Copy, Check } from 'lucide-react'
import DOMPurify from 'dompurify'

// Number Base Converter
export function NumberBaseConverter() {
  const [input, setInput] = useState('255')
  const [fromBase, setFromBase] = useState(10)

  const convert = (val: string, from: number) => {
    try {
      const decimal = parseInt(val, from)
      if (isNaN(decimal)) return null
      return {
        binary: decimal.toString(2),
        octal: decimal.toString(8),
        decimal: decimal.toString(10),
        hex: decimal.toString(16).toUpperCase(),
      }
    } catch {
      return null
    }
  }

  const result = useMemo(() => convert(input, fromBase), [input, fromBase])

  return (
    <div className="flex flex-col gap-6 h-full bg-white border border-border rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <label className="text-sm text-primary block mb-2">Input Value</label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full bg-white border border-border border-border rounded-xl px-4 py-3 text-primary font-mono text-lg focus:outline-none focus:ring-1 focus:ring-text-primary"
            placeholder="Enter a number..."
          />
        </div>
        <div>
          <label className="text-sm text-primary block mb-2">Input Base</label>
          <div className="flex gap-2">
            {[{ label: 'BIN', base: 2 }, { label: 'OCT', base: 8 }, { label: 'DEC', base: 10 }, { label: 'HEX', base: 16 }].map(({ label, base }) => (
              <button key={base} onClick={() => setFromBase(base)} className={`px-4 py-3 rounded-xl text-sm font-bold border transition-colors ${fromBase === base ? 'bg-white border border-border border-border text-primary' : 'bg-white border border-border border-border text-muted hover:text-primary'}`}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {result ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
          {[
            { label: 'Binary (Base 2)', value: result.binary, prefix: '0b' },
            { label: 'Octal (Base 8)', value: result.octal, prefix: '0o' },
            { label: 'Decimal (Base 10)', value: result.decimal, prefix: '' },
            { label: 'Hexadecimal (Base 16)', value: result.hex, prefix: '0x' },
          ].map(({ label, value, prefix }) => (
            <div key={label} className="bg-white border border-border border-border rounded-xl p-5 group cursor-pointer hover:border-border transition-colors" onClick={() => navigator.clipboard.writeText(value)}>
              <div className="text-xs text-muted uppercase tracking-wider mb-2">{label}</div>
              <div className="font-mono text-success text-xl font-bold break-all">{prefix}{value}</div>
              <div className="text-xs text-primary mt-2 group-hover:text-muted transition-colors flex items-center gap-1"><Copy className="w-3 h-3" /> Click to copy</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center flex-grow text-danger text-sm">
          Invalid number for base {fromBase}. Please enter a valid value.
        </div>
      )}
    </div>
  )
}

// Regex Tester
export function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('The quick brown fox jumps over the lazy dog. fox@example.com')
  const [error, setError] = useState('')

  const result = useMemo(() => {
    if (!pattern) return { matches: [], highlighted: testString, count: 0 }
    try {
      setError('')
      const regex = new RegExp(pattern, flags)
      const matches: { match: string; index: number; groups: string[] }[] = []
      let m: RegExpExecArray | null

      if (flags.includes('g')) {
        while ((m = regex.exec(testString)) !== null) {
          matches.push({ match: m[0], index: m.index, groups: Array.from(m).slice(1) })
          if (m.index === regex.lastIndex) regex.lastIndex++
        }
      } else {
        m = regex.exec(testString)
        if (m) matches.push({ match: m[0], index: m.index, groups: Array.from(m).slice(1) })
      }

      // Build highlighted HTML
      let highlighted = ''
      let lastIndex = 0
      const allMatches = [...testString.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))]
      for (const match of allMatches) {
        const matchIndex = match.index ?? 0
        highlighted += testString.slice(lastIndex, matchIndex).replace(/</g, '&lt;')
        highlighted += `<mark class="bg-surface border border-border text-warning rounded px-0.5">${match[0].replace(/</g, '&lt;')}</mark>`
        lastIndex = matchIndex + match[0].length
      }
      highlighted += testString.slice(lastIndex).replace(/</g, '&lt;')

      return { matches, highlighted, count: matches.length }
    } catch (e: any) {
      setError(e.message)
      return { matches: [], highlighted: testString, count: 0 }
    }
  }, [pattern, flags, testString])

  return (
    <div className="flex flex-col gap-4 h-full bg-white border border-border rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex gap-3 items-end">
        <div className="flex-grow">
          <label className="text-sm text-primary block mb-2">Regular Expression</label>
          <div className="flex items-center bg-white border border-border border-border rounded-xl px-4 py-3 gap-3 focus-within:border-border transition-colors">
            <span className="text-muted font-mono">/</span>
            <input
              type="text"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              className="flex-grow bg-transparent text-primary font-mono focus:outline-none"
              placeholder="pattern..."
            />
            <span className="text-muted font-mono">/</span>
            <input
              type="text"
              value={flags}
              onChange={e => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))}
              className="w-14 bg-transparent text-success font-mono focus:outline-none text-sm"
              placeholder="gim"
            />
          </div>
        </div>
        {result.count > 0 && !error && (
          <div className="px-4 py-3 bg-surface border border-border border-border rounded-xl text-success text-sm font-medium whitespace-nowrap">
            {result.count} match{result.count !== 1 ? 'es' : ''}
          </div>
        )}
        {error && (
          <div className="px-4 py-3 bg-surface border border-border border-border rounded-xl text-danger text-xs max-w-xs truncate">
            {error}
          </div>
        )}
      </div>

      <div>
        <label className="text-sm text-primary block mb-2">Test String</label>
        <textarea
          value={testString}
          onChange={e => setTestString(e.target.value)}
          rows={4}
          className="w-full bg-white border border-border border-border rounded-xl p-4 text-primary font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-text-primary"
        />
      </div>

      <div>
        <label className="text-sm text-primary block mb-2">Highlighted Matches</label>
        <div
          className="w-full bg-white border border-border border-border rounded-xl p-4 text-primary font-mono text-sm min-h-[80px] whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.highlighted) }}
        />
      </div>

      {result.matches.length > 0 && (
        <div>
          <label className="text-sm text-primary block mb-2">Match Details</label>
          <div className="space-y-1 max-h-36 overflow-auto">
            {result.matches.map((m, i) => (
              <div key={i} className="flex gap-3 items-center text-xs bg-white border border-border border-border rounded-xl px-3 py-2">
                <span className="text-muted w-5 text-center font-bold">{i + 1}</span>
                <span className="font-mono text-warning font-bold">{m.match || '(empty)'}</span>
                <span className="text-muted">at index {m.index}</span>
                {m.groups.filter(Boolean).length > 0 && (
                  <span className="text-success">groups: [{m.groups.join(', ')}]</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Word Frequency Counter
export function WordFrequency() {
  const [text, setText] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [minLength, setMinLength] = useState(2)

  const stats = useMemo(() => {
    if (!text) return { words: [], totalWords: 0, uniqueWords: 0 }
    const raw = caseSensitive ? text : text.toLowerCase()
    const words = raw.match(/\b[a-zA-Z']+\b/g) || []
    const filtered = words.filter(w => w.length >= minLength)
    const freq: Record<string, number> = {}
    for (const w of filtered) freq[w] = (freq[w] || 0) + 1
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 50)
    return { words: sorted, totalWords: filtered.length, uniqueWords: Object.keys(freq).length }
  }, [text, caseSensitive, minLength])

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full bg-white border border-border rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <label className="text-sm text-primary block mb-2">Input Text</label>
          <textarea
            className="w-full h-56 p-4 bg-white border border-border border-border rounded-xl resize-none text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
            placeholder="Paste your text here to analyze word frequency..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>
        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-3 cursor-pointer text-sm text-primary">
            <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} className="w-4 h-4 rounded bg-white border border-border accent-indigo-500" />
            Case Sensitive
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary">Min length:</span>
            <input type="number" min="1" max="10" value={minLength} onChange={e => setMinLength(parseInt(e.target.value) || 1)} className="w-16 bg-white border border-border border-border rounded-xl px-2 py-1 text-primary text-sm" />
          </div>
        </div>
        {text && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalWords}</div>
              <div className="text-xs text-muted mt-1">Total Words</div>
            </div>
            <div className="bg-white border border-border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-success">{stats.uniqueWords}</div>
              <div className="text-xs text-muted mt-1">Unique Words</div>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <label className="text-sm text-primary block mb-2">Word Frequency (Top 50)</label>
        <div className="flex-grow bg-white border border-border border-border rounded-xl overflow-auto max-h-[500px]">
          {stats.words.length > 0 ? (
            <div className="p-3 space-y-1">
              {stats.words.map(([word, count], i) => (
                <div key={word} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white transition-colors">
                  <span className="text-primary text-xs w-6 text-right">{i + 1}</span>
                  <span className="flex-grow text-primary font-medium">{word}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 bg-surface border border-border rounded-full overflow-hidden w-24">
                      <div className="h-full bg-white border border-border rounded-full" style={{ width: `${(count / stats.words[0][1]) * 100}%` }} />
                    </div>
                    <span className="text-primary text-sm font-bold w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted text-sm">
              {text ? 'No words found with minimum length ' + minLength : 'Paste some text to see word frequency'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// JSON to CSV Converter
export function JsonToCsv() {
  const [input, setInput] = useState('[\n  {"name": "Alice", "age": 30, "city": "New York"},\n  {"name": "Bob", "age": 25, "city": "London"},\n  {"name": "Charlie", "age": 35, "city": "Tokyo"}\n]')
  const [error, setError] = useState('')

  const output = useMemo(() => {
    if (!input.trim()) return ''
    try {
      setError('')
      const data = JSON.parse(input)
      if (!Array.isArray(data)) throw new Error('JSON must be an array of objects')
      if (data.length === 0) return ''

      const headers = Array.from(new Set(data.flatMap(obj => Object.keys(obj))))
      const escape = (val: any) => {
        const str = String(val ?? '')
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str
      }

      const rows = data.map(row => headers.map(h => escape(row[h])).join(','))
      return [headers.join(','), ...rows].join('\n')
    } catch (e: any) {
      setError(e.message)
      return ''
    }
  }, [input])

  const downloadCsv = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-4 h-full bg-white border border-border rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow min-h-[350px]">
        <div className="flex flex-col">
          <label className="text-sm text-primary mb-2">JSON Input (Array of Objects)</label>
          <textarea
            className="flex-grow p-4 bg-white border border-border border-border rounded-xl resize-none text-primary font-mono text-sm focus:outline-none focus:ring-1 focus:ring-text-primary"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='[{"key": "value"}]'
          />
          {error && <p className="text-danger text-xs mt-2">{error}</p>}
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-primary">CSV Output</label>
            <div className="flex gap-2">
              {output && <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-muted hover:text-primary flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>}
            </div>
          </div>
          <textarea
            readOnly
            className="flex-grow p-4 bg-white border border-border border-border rounded-xl resize-none text-success font-mono text-sm"
            value={output}
            placeholder="CSV output will appear here..."
          />
        </div>
      </div>
      <div className="flex gap-3">
        <Button className="bg-white border border-border hover:bg-white-hover text-primary" onClick={downloadCsv} disabled={!output}>
          Download CSV
        </Button>
      </div>
    </div>
  )
}


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
    <div className="flex flex-col gap-6 h-full bg-white border border-border rounded-2xl p-6 shadow-sm max-w-2xl mx-auto w-full">
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-semibold text-primary mb-2 block">String to Hash</label>
          <input
            type="text"
            className="w-full p-4 bg-surface border border-border rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="my_super_secret_password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-primary">Salt Rounds: {rounds}</label>
            <span className="text-xs text-muted">Higher = Slower/More Secure</span>
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
          className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-[#374151] transition-colors disabled:opacity-50"
        >
          {isHashing ? 'Hashing...' : 'Generate Bcrypt Hash'}
        </button>
      </div>

      {hash && (
        <div className="bg-surface border border-border rounded-xl p-4 relative group">
          <label className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2 block">Generated Hash</label>
          <code className="text-primary font-mono text-sm break-all">{hash}</code>
          <button 
            onClick={copy}
            className="absolute top-4 right-4 p-3 bg-white border border-border rounded-2xl shadow-sm hover:bg-surface-hover transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-muted" />}
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
      case 'default':
        setDisallow('/cgi-bin/, /private/, /tmp/');
        break;
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
      output += `User-agent: Googlebot\nAllow: /\n\nUser-agent: *\nDisallow: /\n\n`;
    } else if (reqPreset === 'block-css-js') {
      output += `User-agent: *\nDisallow: /*.css$\nDisallow: /*.js$\n\n`;
    } else {
      // Normal flow
      output += `User-agent: ${userAgent}\n`;
      
      if (delay) output += `Crawl-delay: ${delay}\n`;
      
      const disallowRules = disallow.split(',').map(r => r.trim()).filter(Boolean);
      disallowRules.forEach(r => output += `Disallow: ${r}\n`);
      
      const allowRules = allow.split(',').map(r => r.trim()).filter(Boolean);
      allowRules.forEach(r => output += `Allow: ${r}\n`);
      
      output += '\n';
    }

    // AI Bots
    const blockedBots = Object.entries(bots).filter(([_, checked]) => checked).map(([bot]) => bot);
    if (blockedBots.length > 0) {
      blockedBots.forEach(bot => {
        output += `User-agent: ${bot}\nDisallow: /\n\n`;
      });
    }

    // Sitemap
    if (sitemap) {
      output += `Sitemap: ${sitemap}\n`;
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
    <div className="flex flex-col lg:flex-row gap-6 h-full bg-white border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex-[1.5] flex flex-col gap-6 max-h-[800px] overflow-y-auto pr-2">
        
        {/* Presets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-semibold text-secondary mb-1 block">Based on requirements</label>
            <select value={reqPreset} onChange={(e) => applyReqPreset(e.target.value)} className="w-full p-3 bg-surface border border-border rounded-xl text-[13px] outline-none text-primary">
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
            <label className="text-[13px] font-semibold text-secondary mb-1 block">Based on project</label>
            <select value={projPreset} onChange={(e) => applyProjPreset(e.target.value)} className="w-full p-3 bg-surface border border-border rounded-xl text-[13px] outline-none text-primary">
              <option value="">Select a project...</option>
              <option value="default">Default / Custom Website</option>
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
        <div className="p-4 rounded-xl border border-border bg-white space-y-4">
           <h4 className="text-[13px] font-bold text-primary">Custom Rules</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="text-[12px] font-semibold text-muted mb-1 block">User Agent</label>
               <input type="text" className="w-full p-3 bg-surface border border-border rounded-xl text-[13px]" value={userAgent} onChange={e => setUserAgent(e.target.value)} />
             </div>
             <div>
               <label className="text-[12px] font-semibold text-muted mb-1 block">Crawl Delay (Secs)</label>
               <input type="number" className="w-full p-3 bg-surface border border-border rounded-xl text-[13px]" value={delay} onChange={e => setDelay(e.target.value)} placeholder="e.g. 10" />
             </div>
           </div>
           <div>
             <label className="text-[12px] font-semibold text-muted mb-1 block">Disallow (Comma separated)</label>
             <input type="text" className="w-full p-3 bg-surface border border-border rounded-xl text-[13px]" value={disallow} onChange={e => setDisallow(e.target.value)} />
           </div>
           <div>
             <label className="text-[12px] font-semibold text-muted mb-1 block">Allow (Comma separated)</label>
             <input type="text" className="w-full p-3 bg-surface border border-border rounded-xl text-[13px]" value={allow} onChange={e => setAllow(e.target.value)} />
           </div>
           <div>
             <label className="text-[12px] font-semibold text-muted mb-1 block">Sitemap URL</label>
             <input type="text" className="w-full p-3 bg-surface border border-border rounded-xl text-[13px]" value={sitemap} onChange={e => setSitemap(e.target.value)} />
           </div>
        </div>

        {/* AI Bots Blocking */}
        <div className="p-4 rounded-xl border border-border bg-surface">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[13px] font-bold text-primary">Block AI Bots</h4>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={blockAllBots} onChange={(e) => handleBlockAllBots(e.target.checked)} className="rounded text-primary focus:ring-primary" />
              <span className="text-[13px] font-semibold text-[#DC2626]">Block All Bots</span>
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.keys(bots).map(bot => (
              <label key={bot} className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={bots[bot as keyof typeof bots]} 
                  onChange={(e) => handleBotChange(bot, e.target.checked)} 
                  className="rounded border-border-hover text-primary focus:ring-primary"
                />
                <span className="text-[12px] font-medium text-secondary truncate" title={bot}>{bot}</span>
              </label>
            ))}
          </div>
        </div>

      </div>

      <div className="flex-1 bg-primary rounded-xl p-4 shadow-sm relative group flex flex-col min-h-[400px]">
         <span className="text-[11px] text-subtle mb-2 block font-semibold uppercase tracking-wider">robots.txt Output</span>
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

export function SitemapGenerator() {
  const [baseUrl, setBaseUrl] = useState('https://example.com');
  const [modifiedDate, setModifiedDate] = useState(new Date().toISOString().split('T')[0]);
  const [changeFreq, setChangeFreq] = useState('daily');
  const [priority, setPriority] = useState('0.8');
  const [additionalUrls, setAdditionalUrls] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useMemo(() => {
    const urls = [baseUrl, ...additionalUrls.split('\n').map(u => u.trim()).filter(Boolean)];
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls.map(url => {
        let entry = '  <url>\n';
        entry += `    <loc>${url}</loc>\n`;
        if (modifiedDate) entry += `    <lastmod>${modifiedDate}</lastmod>\n`;
        if (changeFreq) entry += `    <changefreq>${changeFreq}</changefreq>\n`;
        if (priority) entry += `    <priority>${priority}</priority>\n`;
        entry += '  </url>';
        return entry;
      }),
      '</urlset>'
    ].join('\n');
    setOutput(xml);
  }, [baseUrl, modifiedDate, changeFreq, priority, additionalUrls]);

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full bg-white border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex-[1.5] flex flex-col gap-6 max-h-[800px] overflow-y-auto pr-2">
        <div>
          <label className="text-[13px] font-semibold text-secondary mb-1 block">Base URL</label>
          <input
            type="url"
            value={baseUrl}
            onChange={e => setBaseUrl(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-primary focus:outline-none focus:ring-1 focus:ring-text-primary text-[14px]"
            placeholder="https://example.com"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[13px] font-semibold text-secondary mb-1 block">Last Modified</label>
            <input
              type="date"
              value={modifiedDate}
              onChange={e => setModifiedDate(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-primary focus:outline-none focus:ring-1 focus:ring-text-primary text-[14px]"
            />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-secondary mb-1 block">Change Frequency</label>
            <select
              value={changeFreq}
              onChange={e => setChangeFreq(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-primary focus:outline-none focus:ring-1 focus:ring-text-primary text-[14px] appearance-none cursor-pointer"
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
            <label className="text-[13px] font-semibold text-secondary mb-1 block">Priority (0.0 - 1.0)</label>
            <input
              type="number"
              min="0.0"
              max="1.0"
              step="0.1"
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-primary focus:outline-none focus:ring-1 focus:ring-text-primary text-[14px]"
            />
          </div>
        </div>
        <div>
          <label className="text-[13px] font-semibold text-secondary mb-1 block">Additional URLs (One per line)</label>
          <textarea
            value={additionalUrls}
            onChange={e => setAdditionalUrls(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-primary focus:outline-none focus:ring-1 focus:ring-text-primary min-h-[150px] text-[14px] resize-none"
            placeholder={`https://example.com/about\nhttps://example.com/contact`}
          />
        </div>
      </div>
      <div className="flex-[0.8] bg-primary rounded-2xl p-6 shadow-inner relative group flex flex-col">
         <span className="text-[11px] text-subtle mb-2 block font-semibold uppercase tracking-wider">sitemap.xml Output</span>
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
