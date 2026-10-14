import { Navigate, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Signup from './pages/Signup'
import Otp from './pages/Otp'
import Menu from './pages/Menu'
import Cart from './pages/Cart'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  )
}

export default App
