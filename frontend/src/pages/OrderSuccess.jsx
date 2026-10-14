import { useNavigate } from 'react-router-dom'

export default function OrderSuccess() {
  const navigate = useNavigate()

  return (
    <div className="phone-screen">
      <div className="spacer-grow" />
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#fff',
            fontSize: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          ✓
        </div>
        <h1 className="title" style={{ textAlign: 'center' }}>
          Order placed!
        </h1>
        <p className="subtitle" style={{ textAlign: 'center' }}>
          Your order has been placed successfully and is being prepared.
        </p>
      </div>
      <div className="spacer-grow" />
      <button className="btn-primary" onClick={() => navigate('/menu')}>
        Back to menu
      </button>
    </div>
  )
}
