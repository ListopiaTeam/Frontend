import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Events from './pages/Events.jsx'
import Header from './components/Header.jsx'
import Register from './pages/Register.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/" element={<App />}/>
          <Route path="/events" element={<Events/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </BrowserRouter>
    </StrictMode>
)