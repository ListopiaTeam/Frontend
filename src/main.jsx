import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import App from './App.jsx'
import './index.css'

// Pages
import Events from './pages/Events.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import CreateList from './pages/CreateList.jsx'

// Components
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ScrollTop from './components/ScrollTop.jsx'

const AppWrapper = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.key}>
        <Route 
          path="/" 
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.125 }}>
              <App />
            </motion.div>
          }
        />
        <Route 
          path="/events" 
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
              <Events />
            </motion.div>
          }
        />
        <Route 
          path="/register" 
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
              <Register />
            </motion.div>
          }
        />
        <Route 
          path="/login" 
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
              <Login />
            </motion.div>
          }
        />
        <Route 
          path="/create" 
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
              <CreateList />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <AppWrapper />
        <ScrollTop />
        <Footer />
      </div>
    </BrowserRouter>
  </StrictMode>
)
