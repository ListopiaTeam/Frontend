import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from "motion/react"
import { UserContext } from '../UserContext'

const Header = () => {
  const [show, setShow] = useState(false)
  const { user, logoutUser } = useContext(UserContext)  
  const navigate = useNavigate()
  const toggleMenu = () => {
    setShow(!show)
  }

  const logOut = () => {
    logoutUser()
    navigate("/")
  }

  return (
    <nav>
      <ul className='font-mono flex items-center justify-between p-5 z-50 bg-stone-800/85 px-4 shadow-xl text-slate-100 text-xl fixed top-0 left-0 w-full'>
        
        {/* Icon */}
        <AnimatePresence>
        {!show && (
          <div className="md:hidden flex items-center cursor-pointer" onClick={toggleMenu}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </div>
        )}
        {show && (
          <div className="md:hidden flex items-center cursor-pointer" onClick={toggleMenu}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        )}
        </AnimatePresence>

      <img className='h-8 md:mr-5 mr-0 select-none' src="Listopia_Icon_v2_big.png" alt="Listopia" />

        {/* Large screen */}
        <div className="hidden md:flex md:flex-row flex-col gap-8 w-full">
          <div className="flex gap-8">
            <NavLink to={"/"} className={({isActive}) => isActive ? "text-rose-500 cursor-pointer before:content-['>']" : "text-slate-100 cursor-pointer"}>Home</NavLink>
            {user && (
              <>
                <NavLink to={"/create"} className={({isActive}) => isActive ? "text-rose-500 cursor-pointer before:content-['>']" : "text-slate-100 cursor-pointer"}>Create List</NavLink>
                <NavLink to={"/events"} className={({isActive}) => isActive ? "text-rose-500 cursor-pointer before:content-['>']" : "text-slate-100 cursor-pointer"}>Events</NavLink>
              </>
            )}
            <NavLink to={"/lists"} className={({isActive}) => isActive ? "text-rose-500 cursor-pointer before:content-['>']" : "text-slate-100 cursor-pointer"}>Lists</NavLink>
          </div>
          {!user ? (
            <div className="flex gap-8 ml-auto">
              <NavLink to={"/register"}  className={({isActive}) => isActive ? "text-rose-500 cursor-pointer before:content-['>']" : "text-slate-100 cursor-pointer"}>Register</NavLink>
              <NavLink to={"/login"}  className={({isActive}) => isActive ? "text-rose-500 cursor-pointer before:content-['>']" : "text-slate-100 cursor-pointer"}>Login</NavLink>
            </div>
          ) : 
          (
            <div className="flex gap-8 ml-auto">
              <NavLink to={"/profile"}  className={({isActive}) => isActive ? "text-rose-500 cursor-pointer before:content-['>']" : "text-slate-100 cursor-pointer"}>{user?.displayName}</NavLink>
              <button onClick={logOut} className="text-slate-100 cursor-pointer">Logout</button>
            </div>
          )}
        </div>

      {/* Menu open */}
      <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}  
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}    
              transition={{ duration: 0.1 }} 
              className="md:hidden absolute top-[70px] left-0 w-full bg-stone-900/90 backdrop-blur-sm p-5 select-none"
            >
              <div className="flex flex-col gap-5">
                <NavLink to={"/"} onClick={() => setShow(!show)} className={({isActive}) => isActive ? "text-rose-500 cursor-pointer before:content-['>']" : "text-slate-100 cursor-pointer"}>Home</NavLink>
                {user && (
                  <>
                    <NavLink to={"/create"} onClick={() => setShow(!show)}  className={({isActive}) => isActive ? "text-rose-500 cursor-pointer before:content-['>']" : "text-slate-100 cursor-pointer"}>Create List</NavLink>
                    <NavLink to={"/events"} onClick={() => setShow(!show)}  className={({isActive}) => isActive ? "text-rose-500 cursor-pointer before:content-['>']" : "text-slate-100 cursor-pointer"}>Events</NavLink>
                  </>
                )}
                <NavLink to={"/lists"} className={({isActive}) => isActive ? "text-rose-500 cursor-pointer before:content-['>']" : "text-slate-100 cursor-pointer"}>Lists</NavLink>
                {!user ? (
                  <>
                    <NavLink to={"/register"} onClick={() => setShow(!show)}  className={({isActive}) => isActive ? "text-rose-500 cursor-pointer before:content-['>']" : "text-slate-100 cursor-pointer"}>Register</NavLink>
                    <NavLink to={"/login"} onClick={() => setShow(!show)}  className={({isActive}) => isActive ? "text-rose-500 cursor-pointer before:content-['>']" : "text-slate-100 cursor-pointer"}>Login</NavLink>
                  </>
                ) : (
                  <button onClick={logOut} className="text-slate-100 text-left cursor-pointer">Logout</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ul>
    </nav>
  )
}

export default Header
