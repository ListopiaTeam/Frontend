import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Events from './pages/Events.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ScrollTop from './components/ScrollTop.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/events" element={<Events />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        <ScrollTop/>
        <Footer />
      </div>
    </BrowserRouter>
  </StrictMode>
)
