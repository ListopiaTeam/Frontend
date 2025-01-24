import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => {
  const [show, setShow] = useState(false)

  const toggleMenu = () => {
    setShow(!show)
  }

  return (
    <nav>
      <ul className='font-mono flex justify-between p-5 z-50 bg-stone-800/85  sm:rounded-bl-lg sm:rounded-br-lg px-4 shadow-xl text-slate-100 text-xl fixed top-0 left-0 w-full'>
        
        {/* Icon */}
        <div className="sm:hidden flex items-center" onClick={toggleMenu}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </div>

        {/* Large screen */}
        <div className="hidden sm:flex sm:flex-row flex-col gap-8 w-full">
          <div className="flex gap-8">
            <NavLink to={"/"} className="cursor-pointer">Home</NavLink>
            <NavLink to={"/events"} className="cursor-pointer">Events</NavLink>
            <NavLink className="cursor-pointer">Create list</NavLink>
          </div>
          <div className="flex gap-8 ml-auto">
            <NavLink to={"/register"} className="cursor-pointer">Register</NavLink>
            <NavLink to={"/login"} className="cursor-pointer">Login</NavLink>
          </div>
        </div>

      {/* Menu open */}
        <div className={`sm:hidden ${show ? 'block' : 'hidden'} absolute top-16 left-0 w-full bg-stone-800/85 backdrop-blur-sm p-5`}>
          <div className="flex flex-col gap-5">
            <NavLink to={"/"} className="cursor-pointer">Home</NavLink>
            <NavLink to={"/events"} className="cursor-pointer">Events</NavLink>
            <NavLink className="cursor-pointer">Create list</NavLink>
            <NavLink to={"/register"} className="cursor-pointer">Register</NavLink>
            <NavLink to={"/login"} className="cursor-pointer">Login</NavLink>
          </div>
        </div>

      </ul>
    </nav>
  )
}

export default Header
