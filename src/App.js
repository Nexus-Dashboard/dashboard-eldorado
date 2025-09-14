import { BrowserRouter as Router } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import Layout from "./components/Layout/Layout"
import { DataProvider } from "./context/DataContext"

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Layout />
        </div>
      </Router>
    </DataProvider>
  )
}

export default App
