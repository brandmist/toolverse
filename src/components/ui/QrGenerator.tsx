import { useState } from 'react'
import { Button } from './button'
import { Download } from 'lucide-react'

export function QrGenerator() {
  const [text, setText] = useState('https://toolverse.app')
  const qrUrl = text.trim() ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}` : ''

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-black/10">
      <div className="flex-1 flex flex-col justify-center">
         <label className="text-sm font-medium text-text-primary mb-2">QR Code Content</label>
         <textarea
            className="w-full flex-grow min-h-[150px] p-4 bg-card border border-border border-white/10 rounded-xl mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-text-primary"
            placeholder="Enter text, URL, WiFi credentials..."
            value={text}
            onChange={(e) => setText(e.target.value)}
         />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-surface border border-border rounded-xl border border-white/5">
         {qrUrl ? (
            <>
              <div className="bg-white p-4 rounded-xl shadow-xl mb-6 ring-1 ring-white/10">
                <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
              </div>
              <Button variant="outline" className="border-white/10 hover:bg-white/10 w-full text-text-primary" onClick={() => window.open(qrUrl, '_blank')}>
                <Download className="w-4 h-4 mr-2" /> Download QR Code
              </Button>
            </>
         ) : (
            <div className="text-text-muted text-center text-sm">
               Enter some text to generate a QR code
            </div>
         )}
      </div>
    </div>
  )
}
