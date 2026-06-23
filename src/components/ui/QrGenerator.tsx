import { useState } from 'react'
import { Button } from './button'
import { Download } from 'lucide-react'

export function QrGenerator() {
  const [text, setText] = useState('https://smartools.app')
  const qrUrl = text.trim() ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}` : ''

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full bg-white border border-[#E5E7EB] rounded-2xl p-6  shadow-lg shadow-sm">
      <div className="flex-1 flex flex-col justify-center">
         <label className="text-sm font-medium text-[#111827] mb-2">QR Code Content</label>
         <textarea
            className="w-full flex-grow min-h-[150px] p-4 bg-white border border-[#E5E7EB] border-[#E5E7EB] rounded-xl mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-[#111827]"
            placeholder="Enter text, URL, WiFi credentials..."
            value={text}
            onChange={(e) => setText(e.target.value)}
         />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB]">
         {qrUrl ? (
            <>
              <div className="bg-white p-4 rounded-xl shadow-xl mb-6 ring-1 ring-white/10">
                <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
              </div>
              <Button variant="outline" className="border-[#E5E7EB] hover:bg-white/10 w-full text-[#111827]" onClick={() => window.open(qrUrl, '_blank')}>
                <Download className="w-4 h-4 mr-2" /> Download QR Code
              </Button>
            </>
         ) : (
            <div className="text-[#6B7280] text-center text-sm">
               Enter some text to generate a QR code
            </div>
         )}
      </div>
    </div>
  )
}
