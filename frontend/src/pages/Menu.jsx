import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { categories, menuItems } from '../data/menuItems'
import { useCart } from '../context/CartContext'

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')
  const { addItem, count, total } = useCart()
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory
      const matchesQuery = item.name
        .toLowerCase()
        .includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query])

  return (
    <div className="phone-screen">
      <div className="top-bar">
        <div>
          <h1 className="title" style={{ fontSize: 20, margin: 0 }}>
            Hi {localStorage.getItem('userName') || 'there'} 👋
          </h1>
          <p className="subtitle" style={{ margin: 0 }}>
            What would you like to eat?
          </p>
        </div>
        <button className="icon-btn" aria-label="Notifications">
          🔔
        </button>
      </div>

      <div className="search-bar">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Search dishes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="category-row">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="menu-list">
        {filtered.map((item) => (
          <div className="menu-card" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div className="info">
              <h3>{item.name}</h3>
              <p className="desc">{item.desc}</p>
              <p className="price">${item.price.toFixed(2)}</p>
            </div>
            <button className="add-btn" onClick={() => addItem(item)}>
              +
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="empty-state">No dishes found</p>
        )}
      </div>

      {count > 0 && (
        <button className="cart-fab" onClick={() => navigate('/cart')}>
          <span>
            <span className="badge">{count}</span>
            View cart
          </span>
          <span>${total.toFixed(2)}</span>
        </button>
      )}
    </div>
  )
}
