import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const OTP_LENGTH = 6

export default function Otp() {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const [error, setError] = useState('')
  const inputsRef = useRef([])
  const navigate = useNavigate()
  const phone = localStorage.getItem('pendingPhone') || ''

  const handleChange = (index, value) => {
    const val = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = val
    setDigits(next)
    if (val && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleVerify = () => {
    const code = digits.join('')
    if (code.length !== OTP_LENGTH) {
      setError('Enter the complete 6-digit code')
      return
    }
    // Demo flow: any complete 6-digit code is accepted.
    setError('')
    localStorage.setItem('isVerified', 'true')
    navigate('/menu')
  }

  return (
    <div className="phone-screen">
      <h1 className="title">Verify your number</h1>
      <p className="subtitle">
        We sent a 6-digit code to {phone ? `+91 ${phone}` : 'your phone'}
      </p>

      <div className="otp-boxes">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
          />
        ))}
      </div>

      {error && <p className="error-msg">{error}</p>}

      <button className="btn-primary" onClick={handleVerify}>
        Verify &amp; Continue
      </button>

      <div className="spacer-grow" />
      <p className="link-text">
        Didn&apos;t receive the code? <button className="linklike">Resend</button>
      </p>
    </div>
  )
}
