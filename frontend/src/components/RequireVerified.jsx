import { Navigate } from 'react-router-dom'

export default function RequireVerified({ children }) {
  const isVerified = localStorage.getItem('isVerified') === 'true'
  if (!isVerified) {
    return <Navigate to="/" replace />
  }
  return children
}
