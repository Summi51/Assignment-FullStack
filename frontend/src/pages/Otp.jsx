import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const OTP_LENGTH = 6
const RESEND_SECONDS = 30

export default function Otp() {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const [loading, setLoading] = useState(false)
  const inputsRef = useRef([])
  const navigate = useNavigate()
  const phone = localStorage.getItem('pendingPhone') || ''

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  const handleResend = async () => {
    if (secondsLeft > 0) return
    setDigits(Array(OTP_LENGTH).fill(''))
    setError('')
    try {
      await api.post('/api/otp/send', { phone })
      setSecondsLeft(RESEND_SECONDS)
      inputsRef.current[0]?.focus()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP')
    }
  }

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

  const handleVerify = async () => {
    const code = digits.join('')
    if (code.length !== OTP_LENGTH) {
      setError('Enter the complete 6-digit code')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.post('/api/otp/verify', { phone, code })
      localStorage.setItem('isVerified', 'true')
      navigate('/menu')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="phone-screen">
      <div className="top-bar">
        <button className="icon-btn" onClick={() => navigate('/')}>
          ←
        </button>
      </div>
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

      <button className="btn-primary" onClick={handleVerify} disabled={loading}>
        {loading ? 'Verifying...' : 'Verify & Continue'}
      </button>

      <div className="spacer-grow" />
      <p className="link-text">
        Didn&apos;t receive the code?{' '}
        <button
          className="linklike"
          onClick={handleResend}
          disabled={secondsLeft > 0}
        >
          {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Resend'}
        </button>
      </p>
    </div>
  )
}
