const fs = require('fs');
const file = 'src/components/ui/NewCodingTools.tsx';

const jsonToTsCode = `

// JSON to TypeScript Converter
function generateTsInterface(jsonObj: any, rootName = 'Root'): string {
  if (jsonObj === null) return \`export interface \${rootName} {}\`;
  if (Array.isArray(jsonObj)) {
    if (jsonObj.length > 0 && typeof jsonObj[0] === 'object' && jsonObj[0] !== null) {
      return generateTsInterface(jsonObj[0], rootName + 'Item');
    }
    return \`export type \${rootName} = \${typeof jsonObj[0]}[]\`;
  }
  if (typeof jsonObj !== 'object') {
    return \`export type \${rootName} = \${typeof jsonObj}\`;
  }

  const interfaces: string[] = [];
  const lines: string[] = [\`export interface \${rootName} {\`];

  for (const [key, value] of Object.entries(jsonObj)) {
    if (value === null) {
      lines.push(\`  \${key}: any;\`);
    } else if (Array.isArray(value)) {
      if (value.length > 0) {
        if (typeof value[0] === 'object' && value[0] !== null) {
          const childName = key.charAt(0).toUpperCase() + key.slice(1) + 'Item';
          lines.push(\`  \${key}: \${childName}[];\`);
          interfaces.push(generateTsInterface(value[0], childName));
        } else {
          lines.push(\`  \${key}: \${typeof value[0]}[];\`);
        }
      } else {
        lines.push(\`  \${key}: any[];\`);
      }
    } else if (typeof value === 'object') {
      const childName = key.charAt(0).toUpperCase() + key.slice(1);
      lines.push(\`  \${key}: \${childName};\`);
      interfaces.push(generateTsInterface(value, childName));
    } else {
      lines.push(\`  \${key}: \${typeof value};\`);
    }
  }
  lines.push('}');
  return [...interfaces, lines.join('\\n')].join('\\n\\n');
}

export function JsonToTs() {
  const [input, setInput] = useState('{\\n  "name": "SmarTools",\\n  "features": ["fast", "free"]\\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useMemo(() => {
    try {
      if (!input.trim()) { setOutput(''); setError(''); return; }
      const parsed = JSON.parse(input);
      setOutput(generateTsInterface(parsed));
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  }, [input]);

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
      <div className="flex gap-2 items-center">
        {error && <span className="text-danger text-sm">{error}</span>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow min-h-[350px]">
        <div className="flex flex-col">
          <label className="text-sm text-[#111827] mb-2">Input JSON</label>
          <textarea
            className="flex-grow p-4 bg-white border border-[#E5E7EB] rounded-xl resize-none text-[#111827] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
        <div className="flex flex-col relative group">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-[#111827]">TypeScript Interfaces</label>
            {output && <button onClick={copy} className="text-xs text-[#6B7280] hover:text-[#111827] flex items-center gap-1">{copied ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />} Copy</button>}
          </div>
          <textarea
            readOnly
            className="flex-grow p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl resize-none text-primary font-mono text-sm"
            value={output}
            placeholder="Interfaces will appear here..."
          />
        </div>
      </div>
    </div>
  );
}

// CSV JSON Converter
export function CsvJsonConverter() {
  const [input, setInput] = useState('name,age\\nAlice,30\\nBob,25');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json');

  useMemo(() => {
    try {
      if (!input.trim()) { setOutput(''); setError(''); return; }
      if (mode === 'csv-to-json') {
        const lines = input.trim().split('\\n');
        if (lines.length < 2) { setOutput('[]'); return; }
        const headers = lines[0].split(',').map(h => h.trim());
        const result = [];
        for(let i=1; i<lines.length; i++) {
          const obj: any = {};
          const currentLine = lines[i].split(',');
          for(let j=0; j<headers.length; j++) {
            obj[headers[j]] = currentLine[j] ? currentLine[j].trim() : '';
          }
          result.push(obj);
        }
        setOutput(JSON.stringify(result, null, 2));
      } else {
        const parsed = JSON.parse(input);
        if (!Array.isArray(parsed) || parsed.length === 0) { setOutput(''); return; }
        const headers = Object.keys(parsed[0]);
        let csv = headers.join(',') + '\\n';
        for (const row of parsed) {
          csv += headers.map(h => row[h] || '').join(',') + '\\n';
        }
        setOutput(csv.trim());
      }
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  }, [input, mode]);

  return (
    <div className="flex flex-col gap-4 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
      <div className="flex gap-2 items-center">
        <div className="flex bg-[#F3F4F6] p-1 rounded-lg">
          <button onClick={() => setMode('csv-to-json')} className={\`px-4 py-1.5 rounded-md text-[13px] font-semibold transition-all \${mode === 'csv-to-json' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'}\`}>CSV to JSON</button>
          <button onClick={() => setMode('json-to-csv')} className={\`px-4 py-1.5 rounded-md text-[13px] font-semibold transition-all \${mode === 'json-to-csv' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'}\`}>JSON to CSV</button>
        </div>
        {error && <span className="text-danger text-sm ml-4">{error}</span>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow min-h-[350px]">
        <textarea
          className="flex-grow p-4 bg-white border border-[#E5E7EB] rounded-xl resize-none text-[#111827] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode === 'csv-to-json' ? 'Enter CSV here...' : 'Enter JSON array here...'}
        />
        <textarea
          readOnly
          className="flex-grow p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl resize-none text-success font-mono text-sm"
          value={output}
          placeholder="Output will appear here..."
        />
      </div>
    </div>
  );
}
`;

fs.appendFileSync(file, '\n' + jsonToTsCode, 'utf8');
console.log('Appended JsonToTs and CsvJsonConverter');
