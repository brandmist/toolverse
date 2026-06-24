import { useState, useEffect } from 'react'

export function PercentageCalculator() {
  const [val1, setVal1] = useState('')
  const [val2, setVal2] = useState('')
  const [val3, setVal3] = useState('')
  const [val4, setVal4] = useState('')
  
  const calc1 = (parseFloat(val1) / 100) * parseFloat(val2)
  const calc2 = (parseFloat(val3) / parseFloat(val4)) * 100

  return (
    <div className="space-y-6">
      <div className="tool-panel">
        <h3 className="text-lg font-semibold text-[#111827] mb-4">What is X% of Y?</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="tool-label">Percentage (X)</label>
            <input type="number" className="w-full" placeholder="20" value={val1} onChange={e => setVal1(e.target.value)} />
          </div>
          <span className="text-gray-500 font-medium pt-6">% of</span>
          <div className="flex-1 w-full">
            <label className="tool-label">Value (Y)</label>
            <input type="number" className="w-full" placeholder="150" value={val2} onChange={e => setVal2(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl flex items-center justify-between">
          <span className="text-sm text-gray-600 font-medium">Result:</span>
          <span className="text-2xl font-bold text-[#2563EB]">{!isNaN(calc1) ? calc1.toLocaleString() : '---'}</span>
        </div>
      </div>

      <div className="tool-panel">
        <h3 className="text-lg font-semibold text-[#111827] mb-4">X is what % of Y?</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="tool-label">Value (X)</label>
            <input type="number" className="w-full" placeholder="30" value={val3} onChange={e => setVal3(e.target.value)} />
          </div>
          <span className="text-gray-500 font-medium pt-6">is what % of</span>
          <div className="flex-1 w-full">
            <label className="tool-label">Value (Y)</label>
            <input type="number" className="w-full" placeholder="150" value={val4} onChange={e => setVal4(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl flex items-center justify-between">
          <span className="text-sm text-gray-600 font-medium">Result:</span>
          <span className="text-2xl font-bold text-[#059669]">{!isNaN(calc2) ? calc2.toLocaleString() + '%' : '---'}</span>
        </div>
      </div>
    </div>
  )
}

export function BmiCalculator() {
  const [height, setHeight] = useState('175')
  const [weight, setWeight] = useState('70')

  const h = parseFloat(height) / 100
  const w = parseFloat(weight)
  const bmi = w / (h * h)
  
  let category = ''
  let color = ''
  if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-500' }
  else if (bmi < 25) { category = 'Normal weight'; color = 'text-green-500' }
  else if (bmi < 30) { category = 'Overweight'; color = 'text-yellow-500' }
  else { category = 'Obese'; color = 'text-red-500' }

  return (
    <div className="tool-panel">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="tool-label">Height (cm)</label>
          <input type="number" className="w-full" value={height} onChange={e => setHeight(e.target.value)} />
        </div>
        <div>
          <label className="tool-label">Weight (kg)</label>
          <input type="number" className="w-full" value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
      </div>
      <div className="p-6 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-center">
        <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Your BMI</div>
        <div className="text-5xl font-black text-[#111827] mb-2">{!isNaN(bmi) && isFinite(bmi) ? bmi.toFixed(1) : '0.0'}</div>
        <div className={`text-lg font-medium ${color}`}>{!isNaN(bmi) && isFinite(bmi) ? category : '---'}</div>
      </div>
    </div>
  )
}

export function AgeCalculator() {
  const [dob, setDob] = useState('1990-01-01')

  const calcAge = () => {
    if (!dob) return null;
    const birthDate = new Date(dob)
    const today = new Date()
    
    let years = today.getFullYear() - birthDate.getFullYear()
    let months = today.getMonth() - birthDate.getMonth()
    let days = today.getDate() - birthDate.getDate()

    if (months < 0 || (months === 0 && days < 0)) {
      years--
      months += 12
    }
    if (days < 0) {
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      days += prevMonth.getDate()
      months--
    }
    
    return { years, months, days }
  }

  const age = calcAge()

  return (
    <div className="tool-panel">
      <div className="mb-6">
        <label className="tool-label">Date of Birth</label>
        <input type="date" className="w-full" value={dob} onChange={e => setDob(e.target.value)} />
      </div>
      
      {age && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-[#111827] mb-1">{age.years}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Years</div>
          </div>
          <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-[#111827] mb-1">{age.months}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Months</div>
          </div>
          <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-[#111827] mb-1">{age.days}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Days</div>
          </div>
        </div>
      )}
    </div>
  )
}

export function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('1000')
  const [rate, setRate] = useState('5')
  const [time, setTime] = useState('1')

  const p = parseFloat(principal) || 0
  const r = parseFloat(rate) || 0
  const t = parseFloat(time) || 0

  const interest = (p * r * t) / 100
  const total = p + interest

  return (
    <div className="tool-panel space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="tool-label">Principal Amount ($)</label>
          <input type="number" className="w-full" value={principal} onChange={e => setPrincipal(e.target.value)} />
        </div>
        <div>
          <label className="tool-label">Rate of Interest (%)</label>
          <input type="number" className="w-full" value={rate} onChange={e => setRate(e.target.value)} />
        </div>
        <div>
          <label className="tool-label">Time Period (Years)</label>
          <input type="number" className="w-full" value={time} onChange={e => setTime(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-center">
          <div className="text-sm text-gray-500 font-semibold mb-1">Total Interest</div>
          <div className="text-2xl font-bold text-[#059669]">${interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div className="p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-center">
          <div className="text-sm text-gray-500 font-semibold mb-1">Total Amount</div>
          <div className="text-2xl font-bold text-[#111827]">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </div>
    </div>
  )
}

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('1000')
  const [rate, setRate] = useState('5')
  const [time, setTime] = useState('10')
  const [compound, setCompound] = useState('12') // Default monthly

  const p = parseFloat(principal) || 0
  const r = parseFloat(rate) || 0
  const t = parseFloat(time) || 0
  const n = parseInt(compound) || 1

  const amount = p * Math.pow(1 + (r / 100) / n, n * t)
  const interest = amount - p

  return (
    <div className="tool-panel space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="tool-label">Principal Amount ($)</label>
          <input type="number" className="w-full" value={principal} onChange={e => setPrincipal(e.target.value)} />
        </div>
        <div>
          <label className="tool-label">Annual Interest Rate (%)</label>
          <input type="number" className="w-full" value={rate} onChange={e => setRate(e.target.value)} />
        </div>
        <div>
          <label className="tool-label">Time Period (Years)</label>
          <input type="number" className="w-full" value={time} onChange={e => setTime(e.target.value)} />
        </div>
        <div>
          <label className="tool-label">Compound Frequency</label>
          <select className="w-full" value={compound} onChange={e => setCompound(e.target.value)}>
            <option value="365">Daily</option>
            <option value="12">Monthly</option>
            <option value="4">Quarterly</option>
            <option value="2">Semi-Annually</option>
            <option value="1">Annually</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-center">
          <div className="text-sm text-gray-500 font-semibold mb-1">Total Interest Earned</div>
          <div className="text-2xl font-bold text-[#059669]">${interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div className="p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-center">
          <div className="text-sm text-gray-500 font-semibold mb-1">Total Future Value</div>
          <div className="text-2xl font-bold text-[#111827]">${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </div>
    </div>
  )
}

export function LoanCalculator() {
  const [amount, setAmount] = useState('10000')
  const [rate, setRate] = useState('8')
  const [months, setMonths] = useState('12')

  const p = parseFloat(amount) || 0
  const rAnnual = parseFloat(rate) || 0
  const n = parseInt(months) || 0

  const r = (rAnnual / 12) / 100
  
  let emi = 0
  let totalInterest = 0
  let totalPayment = 0

  if (p > 0 && r > 0 && n > 0) {
    emi = p * r * (Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    totalPayment = emi * n
    totalInterest = totalPayment - p
  } else if (p > 0 && n > 0) {
    emi = p / n
    totalPayment = p
  }

  return (
    <div className="tool-panel space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="tool-label">Loan Amount ($)</label>
          <input type="number" className="w-full" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div>
          <label className="tool-label">Annual Interest Rate (%)</label>
          <input type="number" className="w-full" value={rate} onChange={e => setRate(e.target.value)} />
        </div>
        <div>
          <label className="tool-label">Loan Tenure (Months)</label>
          <input type="number" className="w-full" value={months} onChange={e => setMonths(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-center">
          <div className="text-sm text-gray-500 font-semibold mb-1">Monthly EMI</div>
          <div className="text-2xl font-bold text-[#2563EB]">${emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div className="p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-center">
          <div className="text-sm text-gray-500 font-semibold mb-1">Total Interest</div>
          <div className="text-2xl font-bold text-[#EF4444]">${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div className="p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-center">
          <div className="text-sm text-gray-500 font-semibold mb-1">Total Payment</div>
          <div className="text-2xl font-bold text-[#111827]">${totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </div>
    </div>
  )
}

export function SipCalculator() {
  const [investment, setInvestment] = useState('500')
  const [rate, setRate] = useState('12')
  const [years, setYears] = useState('10')

  const p = parseFloat(investment) || 0
  const rAnnual = parseFloat(rate) || 0
  const y = parseInt(years) || 0
  const n = y * 12

  const i = (rAnnual / 100) / 12

  let futureValue = 0
  let investedAmount = p * n
  let estimatedReturns = 0

  if (p > 0 && i > 0 && n > 0) {
    futureValue = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i)
    estimatedReturns = futureValue - investedAmount
  } else if (p > 0 && n > 0) {
    futureValue = investedAmount
  }

  return (
    <div className="tool-panel space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="tool-label">Monthly Investment ($)</label>
          <input type="number" className="w-full" value={investment} onChange={e => setInvestment(e.target.value)} />
        </div>
        <div>
          <label className="tool-label">Expected Return (p.a %)</label>
          <input type="number" className="w-full" value={rate} onChange={e => setRate(e.target.value)} />
        </div>
        <div>
          <label className="tool-label">Time Period (Years)</label>
          <input type="number" className="w-full" value={years} onChange={e => setYears(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-center">
          <div className="text-sm text-gray-500 font-semibold mb-1">Invested Amount</div>
          <div className="text-2xl font-bold text-[#6B7280]">${investedAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
        </div>
        <div className="p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-center">
          <div className="text-sm text-gray-500 font-semibold mb-1">Est. Returns</div>
          <div className="text-2xl font-bold text-[#10B981]">${estimatedReturns.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
        </div>
        <div className="p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-center">
          <div className="text-sm text-gray-500 font-semibold mb-1">Total Value</div>
          <div className="text-2xl font-bold text-[#111827]">${futureValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
        </div>
      </div>
    </div>
  )
}

export function CurrencyConverter() {
  const [amount, setAmount] = useState('1')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')
  const [rates, setRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        setRates(data.rates || {})
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching rates", err)
        setLoading(false)
      })
  }, [])

  const amt = parseFloat(amount) || 0
  let result = 0
  if (rates[from] && rates[to]) {
    const amountInUSD = amt / rates[from]
    result = amountInUSD * rates[to]
  }

  const currencies = Object.keys(rates).length > 0 ? Object.keys(rates) : ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD']

  return (
    <div className="tool-panel space-y-6">
      {loading && <div className="text-center text-gray-500 font-medium">Loading latest live rates...</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="tool-label">Amount</label>
          <input type="number" className="w-full" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div>
          <label className="tool-label">From</label>
          <select className="w-full" value={from} onChange={e => setFrom(e.target.value)}>
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="tool-label">To</label>
          <select className="w-full" value={to} onChange={e => setTo(e.target.value)}>
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="p-6 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-center">
        <div className="text-sm text-gray-500 font-semibold mb-1">{amount} {from} equals</div>
        <div className="text-4xl font-bold text-[#111827]">
          {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {to}
        </div>
      </div>
    </div>
  )
}
