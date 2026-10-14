import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/useCart'

const DELIVERY_FEE = 2.5

export default function Cart() {
  const { items, updateQty, total, clearCart } = useCart()
  const navigate = useNavigate()

  const handlePlaceOrder = () => {
    clearCart()
    navigate('/order-success')
  }
  const grandTotal = total + (items.length > 0 ? DELIVERY_FEE : 0)

  return (
    <div className="phone-screen">
      <div className="top-bar">
        <button className="icon-btn" onClick={() => navigate('/menu')}>
          ←
        </button>
        <h1 className="title" style={{ fontSize: 20, margin: 0 }}>
          Your Cart
        </h1>
        <div style={{ width: 40 }} />
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty</p>
          <button
            className="btn-primary"
            style={{ marginTop: 16 }}
            onClick={() => navigate('/menu')}
          >
            Browse menu
          </button>
        </div>
      ) : (
        <>
          <div className="menu-list" style={{ gap: 0 }}>
            {items.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="info">
                  <h3>{item.name}</h3>
                  <p className="price">${item.price.toFixed(2)}</p>
                </div>
                <div className="qty-control">
                  <button onClick={() => updateQty(item.id, -1)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="spacer-grow" />

          <div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery fee</span>
              <span>${DELIVERY_FEE.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
            <button
              className="btn-primary"
              style={{ marginTop: 16 }}
              onClick={handlePlaceOrder}
            >
              Place order
            </button>
          </div>
        </>
      )}
    </div>
  )
}
