import { BrowserRouter as Router } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import Layout from "./components/Layout/Layout"
import { DataProvider } from "./context/DataContext"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/Auth/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="App">
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  )
}

export default App
