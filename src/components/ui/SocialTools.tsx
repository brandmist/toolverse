import { useState, useEffect } from 'react'
import { Button } from './button'
import { Copy, Check } from 'lucide-react'

// OpenGraph Meta Tag Generator
export function OpenGraphGenerator() {
  const [data, setData] = useState({
    title: '',
    desc: '',
    url: '',
    image: '',
  })

  const html = `<meta property="og:title" content="${data.title}" />
<meta property="og:description" content="${data.desc}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${data.url}" />
<meta property="og:image" content="${data.image}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${data.title}" />
<meta name="twitter:description" content="${data.desc}" />
<meta name="twitter:image" content="${data.image}" />`

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full bg-white border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex-1 space-y-4">
        <div>
          <label className="text-sm font-medium text-primary block mb-1">Page Title</label>
          <input type="text" value={data.title} onChange={e => setData({...data, title: e.target.value})} className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-primary focus:ring-1 focus:ring-text-primary focus:outline-none" placeholder="Awesome Site" />
        </div>
        <div>
          <label className="text-sm font-medium text-primary block mb-1">Description</label>
          <textarea value={data.desc} onChange={e => setData({...data, desc: e.target.value})} className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-primary resize-none h-24 focus:ring-1 focus:ring-text-primary focus:outline-none" placeholder="Description of the page..." />
        </div>
        <div>
          <label className="text-sm font-medium text-primary block mb-1">URL</label>
          <input type="url" value={data.url} onChange={e => setData({...data, url: e.target.value})} className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-primary focus:ring-1 focus:ring-text-primary focus:outline-none" placeholder="https://example.com" />
        </div>
        <div>
          <label className="text-sm font-medium text-primary block mb-1">Image URL</label>
          <input type="url" value={data.image} onChange={e => setData({...data, image: e.target.value})} className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-primary focus:ring-1 focus:ring-text-primary focus:outline-none" placeholder="https://example.com/og-image.jpg" />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <span className="text-sm font-medium text-primary mb-2 block">Preview Card</span>
          {data.title ? (
            <div className="rounded-xl overflow-hidden bg-surface border border-border shadow-sm">
              {data.image && <img src={data.image} alt="OG Preview" className="w-full h-40 object-cover" onError={e => (e.currentTarget.style.display = 'none')} />}
              <div className="p-4">
                <div className="text-xs text-muted uppercase mb-1">{data.url || 'example.com'}</div>
                <div className="font-bold text-primary text-sm">{data.title}</div>
                {data.desc && <div className="text-muted text-xs mt-1 line-clamp-2">{data.desc}</div>}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed bg-surface border-border p-6 text-center text-muted text-sm">Fill in the fields to see a preview</div>
          )}
        </div>
        <div>
           <span className="text-sm font-medium text-primary mb-2 block">Generated Meta Tags</span>
           <textarea
             readOnly
             className="w-full h-48 p-4 bg-surface border border-border rounded-xl resize-none text-primary font-mono text-xs whitespace-pre break-all leading-relaxed focus:outline-none"
             value={html}
           />
           <Button className="w-full mt-4 bg-button-primary text-button-primary-text hover:opacity-90" onClick={() => navigator.clipboard.writeText(html)}>Copy Meta Tags</Button>
        </div>
      </div>
    </div>
  )
}

// Tweet to Image — functional tweet card builder (no API needed)
export function TweetToImage() {
  const [name, setName] = useState('John Doe')
  const [handle, setHandle] = useState('johndoe')
  const [tweet, setTweet] = useState('Just discovered SmarTools — the most powerful browser-based tool collection. Absolutely mind-blowing! 🚀 #productivity #tools')
  const [likes, setLikes] = useState('1.2K')
  const [retweets, setRetweets] = useState('348')
  const [cardTheme, setCardTheme] = useState<'dark' | 'light'>('light')

  const downloadCard = () => {
    // Notify user to screenshot since html2canvas isn't in deps
    alert('To download: Right-click the tweet card preview → "Save image as...", or take a screenshot of the card.')
  }

  const bg = cardTheme === 'dark' ? 'bg-[#000000]' : 'bg-[#FFFFFF]'
  const textColor = cardTheme === 'dark' ? 'text-[#FFFFFF]' : 'text-[#000000]'
  const subText = cardTheme === 'dark' ? 'text-[#737373]' : 'text-[#525252]'
  const border = cardTheme === 'dark' ? 'border-[#262626]' : 'border-border'

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full bg-white border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex-1 space-y-4 max-w-[320px]">
        <h3 className="font-semibold text-primary mb-2">Tweet Card Builder</h3>
        <div>
          <label className="text-xs text-muted block mb-1">Display Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-primary text-sm focus:ring-1 focus:ring-text-primary focus:outline-none" />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Handle (without @)</label>
          <input type="text" value={handle} onChange={e => setHandle(e.target.value)} className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-primary text-sm focus:ring-1 focus:ring-text-primary focus:outline-none" />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Tweet Text</label>
          <textarea value={tweet} onChange={e => setTweet(e.target.value)} rows={4} className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-primary text-sm resize-none focus:ring-1 focus:ring-text-primary focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted block mb-1">Likes</label>
            <input type="text" value={likes} onChange={e => setLikes(e.target.value)} className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-primary text-sm focus:ring-1 focus:ring-text-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Retweets</label>
            <input type="text" value={retweets} onChange={e => setRetweets(e.target.value)} className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-primary text-sm focus:ring-1 focus:ring-text-primary focus:outline-none" />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCardTheme('dark')} className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${cardTheme === 'dark' ? 'bg-text-primary text-background' : 'bg-surface border-border text-muted hover:text-primary'}`}>Dark</button>
          <button onClick={() => setCardTheme('light')} className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${cardTheme === 'light' ? 'bg-text-primary text-background' : 'bg-surface border-border text-muted hover:text-primary'}`}>Light</button>
        </div>
        <Button className="w-full bg-surface border border-border hover:bg-white-hover text-primary" onClick={downloadCard}>
          📥 Screenshot Instructions
        </Button>
      </div>
      <div className="flex-[2] flex items-center justify-center p-4 bg-surface border border-border rounded-xl min-h-[300px]">
        <div className={`${bg} rounded-2xl p-6 shadow-sm w-full max-w-[500px] border ${border}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 ${textColor} border ${border}`}>
              {name[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div className={`font-bold ${textColor}`}>{name}</div>
              <div className={`text-sm ${subText}`}>@{handle}</div>
            </div>
            <div className="ml-auto">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-primary"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </div>
          </div>
          <p className={`${textColor} text-base leading-relaxed mb-4 whitespace-pre-wrap`}>{tweet}</p>
          <div className={`flex gap-6 pt-4 border-t ${border} ${subText} text-sm`}>
            <span><strong className={textColor}>{retweets}</strong> Retweets</span>
            <span><strong className={textColor}>{likes}</strong> Likes</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// YouTube Thumbnail Grabber
export function YoutubeThumbnail() {
  const [url, setUrl] = useState('')
  const [thumb, setThumb] = useState('')
  const [quality, setQuality] = useState<'maxresdefault' | 'hqdefault' | 'mqdefault'>('maxresdefault')

  const extractId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/)
    return (match && match[1]) ? match[1] : null
  }

  const fetchThumb = () => {
    const id = extractId(url)
    if (id) {
       setThumb(`https://img.youtube.com/vi/${id}/${quality}.jpg`)
    } else {
       setThumb('')
       alert("Invalid YouTube URL. Please paste a valid YouTube video URL.")
    }
  }

  return (
    <div className="flex flex-col h-full bg-white border border-border rounded-2xl p-6 shadow-sm">
       <div className="flex gap-4 mb-4">
         <input
           type="text"
           value={url}
           onChange={e => setUrl(e.target.value)}
           onKeyDown={e => e.key === 'Enter' && fetchThumb()}
           placeholder="Paste YouTube Video URL..."
           className="flex-grow bg-surface border border-border rounded-xl px-4 py-3 text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
         />
         <Button className="bg-button-primary text-button-primary-text hover:opacity-90 h-auto px-6" onClick={fetchThumb}>Grab Thumbnail</Button>
       </div>
       <div className="flex gap-3 mb-6">
         {(['maxresdefault', 'hqdefault', 'mqdefault'] as const).map(q => (
           <button key={q} onClick={() => setQuality(q)} className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${quality === q ? 'bg-text-primary text-background' : 'bg-surface border-border text-muted hover:text-primary'}`}>
             {q === 'maxresdefault' ? 'Max (1280px)' : q === 'hqdefault' ? 'HQ (480px)' : 'MQ (320px)'}
           </button>
         ))}
       </div>
       <div className="flex-grow flex flex-col items-center justify-center bg-surface border border-border rounded-xl min-h-[300px] p-6">
         {thumb ? (
            <div className="flex flex-col gap-4 items-center w-full max-w-4xl">
              <img src={thumb} alt="Thumbnail" className="w-full rounded-xl shadow-sm object-contain" onError={() => { setThumb(''); alert("Thumbnail not available in this quality. Try a lower quality setting."); }} />
              <a href={thumb} target="_blank" rel="noreferrer" download={`thumbnail-${quality}.jpg`}>
                <Button className="bg-button-primary text-button-primary-text hover:opacity-90">Download {quality === 'maxresdefault' ? 'HD' : quality === 'hqdefault' ? 'HQ' : 'MQ'} Thumbnail</Button>
              </a>
            </div>
         ) : (
            <span className="text-muted">Thumbnail preview will appear here</span>
         )}
       </div>
    </div>
  )
}


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
    let output = `<!-- Standard Meta Tags -->\n`;
    if (title) output += `<title>${title}</title>\n`;
    if (description) output += `<meta name="description" content="${description}">\n`;
    if (keywords) output += `<meta name="keywords" content="${keywords}">\n`;
    if (author) output += `<meta name="author" content="${author}">\n`;

    output += `\n<!-- Open Graph / Facebook -->\n`;
    output += `<meta property="og:type" content="website">\n`;
    if (url) output += `<meta property="og:url" content="${url}">\n`;
    if (title) output += `<meta property="og:title" content="${title}">\n`;
    if (description) output += `<meta property="og:description" content="${description}">\n`;
    if (imageUrl) output += `<meta property="og:image" content="${imageUrl}">\n`;

    output += `\n<!-- Twitter -->\n`;
    output += `<meta property="twitter:card" content="summary_large_image">\n`;
    if (url) output += `<meta property="twitter:url" content="${url}">\n`;
    if (title) output += `<meta property="twitter:title" content="${title}">\n`;
    if (description) output += `<meta property="twitter:description" content="${description}">\n`;
    if (imageUrl) output += `<meta property="twitter:image" content="${imageUrl}">\n`;

    return output.trim();
  };

  const output = generateMeta();

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full bg-white border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <label className="text-[13px] font-semibold text-secondary mb-1 block">Page Title</label>
          <input type="text" className="w-full p-3 bg-surface border border-border rounded-xl text-[14px]" value={title} onChange={e => setTitle(e.target.value)} placeholder="My Awesome Website" />
        </div>
        <div>
          <label className="text-[13px] font-semibold text-secondary mb-1 block">Description</label>
          <textarea className="w-full p-3 bg-surface border border-border rounded-xl text-[14px] resize-none h-20" value={description} onChange={e => setDescription(e.target.value)} placeholder="A brief description of the page..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-semibold text-secondary mb-1 block">Keywords</label>
            <input type="text" className="w-full p-3 bg-surface border border-border rounded-xl text-[14px]" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="seo, tools, generator" />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-secondary mb-1 block">Author</label>
            <input type="text" className="w-full p-3 bg-surface border border-border rounded-xl text-[14px]" value={author} onChange={e => setAuthor(e.target.value)} placeholder="John Doe" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-semibold text-secondary mb-1 block">Page URL</label>
            <input type="text" className="w-full p-3 bg-surface border border-border rounded-xl text-[14px]" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-secondary mb-1 block">Image URL (OG/Twitter)</label>
            <input type="text" className="w-full p-3 bg-surface border border-border rounded-xl text-[14px]" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://.../image.jpg" />
          </div>
        </div>
      </div>
      <div className="flex-1 bg-primary rounded-xl p-4 shadow-sm relative group flex flex-col">
         <span className="text-[11px] text-subtle mb-2 block font-semibold uppercase tracking-wider">HTML Output</span>
         <textarea
           readOnly
           value={output}
           className="flex-1 bg-transparent text-[#A7F3D0] font-mono text-[13px] resize-none outline-none border-none p-0"
         />
         <button 
           onClick={copy}
           className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors backdrop-blur-sm"
           title="Copy Code"
         >
           {copied ? <Check className="w-4 h-4 text-[#34D399]" /> : <Copy className="w-4 h-4" />}
         </button>
      </div>
    </div>
  );
}
