import { useAuth } from "../../context/AuthContext"
import AuthScreen from "./AuthScreen"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, login } = useAuth()

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticate={login} />
  }

  return children
}

export default ProtectedRoute