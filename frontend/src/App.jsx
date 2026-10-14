import { Navigate, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import RequireVerified from './components/RequireVerified'
import Signup from './pages/Signup'
import Otp from './pages/Otp'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import OrderSuccess from './pages/OrderSuccess'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/otp" element={<Otp />} />
        <Route
          path="/menu"
          element={
            <RequireVerified>
              <Menu />
            </RequireVerified>
          }
        />
        <Route
          path="/cart"
          element={
            <RequireVerified>
              <Cart />
            </RequireVerified>
          }
        />
        <Route
          path="/order-success"
          element={
            <RequireVerified>
              <OrderSuccess />
            </RequireVerified>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  )
}

export default App
