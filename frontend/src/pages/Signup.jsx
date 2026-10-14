import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      setError('Enter a valid 10-digit phone number')
      return
    }
    setError('')
    localStorage.setItem('pendingPhone', phone)
    localStorage.setItem('userName', name)
    navigate('/otp')
  }

  return (
    <div className="phone-screen">
      <h1 className="title">Create account</h1>
      <p className="subtitle">Sign up to start ordering your favorite food</p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            type="tel"
            placeholder="9876543210"
            value={phone}
            maxLength={10}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          />
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="btn-primary">
          Send OTP
        </button>
      </form>

      <div className="spacer-grow" />
      <p className="link-text">
        Already have an account? <a href="/">Log in</a>
      </p>
    </div>
  )
}
