import { useState, useEffect, useCallback } from 'react'
import { Button } from './button'
import { RefreshCw } from 'lucide-react'
import { CopyButton } from './ToolLayout'

export function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  })

  const generatePassword = useCallback(() => {
    let charset = ''
    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (options.numbers) charset += '0123456789'
    if (options.symbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-='

    if (charset === '') {
      setPassword('Select at least one option')
      return;
    }

    let newPassword = ''
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setPassword(newPassword)
  }, [length, options])

  useEffect(() => {
    generatePassword()
  }, [generatePassword])

  return (
    <div className="tool-panel">
      <div className="relative mb-4">
        <div className="w-full min-h-[100px] flex items-center justify-center p-6 text-center text-2xl sm:text-3xl font-mono tracking-wider bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl break-all text-[#111827] font-bold">
          {password}
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
            <CopyButton text={password} className="!bg-white !shadow-sm" />
            <Button variant="outline" size="icon" className="h-[28px] w-[28px] bg-white text-[#6B7280] shadow-sm" onClick={generatePassword}>
               <RefreshCw className="w-3.5 h-3.5" />
            </Button>
        </div>
      </div>

      <div className="space-y-8">
        <div>
           <div className="flex justify-between items-center mb-4">
             <label className="tool-label !mb-0">Password Length</label>
             <span className="text-[13px] font-bold text-[#111827] bg-[#F3F4F6] px-2 py-1 rounded-md">{length}</span>
           </div>
           <input 
             type="range" 
             min="4" 
             max="64" 
             value={length} 
             onChange={(e) => setLength(parseInt(e.target.value))}
             className="w-full cursor-pointer"
           />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {Object.entries(options).map(([key, value]) => (
               <label key={key} className="flex items-center space-x-3 cursor-pointer text-[#374151] select-none hover:bg-[#FAFAFA] p-3 -ml-2 rounded-xl transition-colors">
                 <input 
                   type="checkbox" 
                   checked={value}
                   onChange={() => setOptions(prev => ({ ...prev, [key]: !prev[key as keyof typeof options] }))}
                   className="w-[18px] h-[18px] rounded"
                 />
                 <span className="text-[14px] font-medium capitalize">{key}</span>
               </label>
           ))}
        </div>
      </div>
      
      <Button variant="primary" className="mt-4 w-full h-12 text-[15px]" onClick={generatePassword}>
        Generate New Password
      </Button>
    </div>
  )
}
