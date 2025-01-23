import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <nav>
        <ul className='font-mono flex justify-between p-5 z-50 bg-stone-800/85 rounded-bl-lg rounded-br-lg px-4 shadow-xl text-slate-100 text-xl fixed top-0 left-0 w-full'>
            <div className='flex gap-8'>
                <NavLink to={"/"} className='cursor-pointer'>Home</NavLink>
                <NavLink to={"/events"} className='cursor-pointer'>Events</NavLink>
                <NavLink className='cursor-pointer'>Create list</NavLink>
            </div>
            <div className='flex gap-8'>
                <NavLink className='cursor-pointer'>Register</NavLink>
                <NavLink className='cursor-pointer'>Login</NavLink>
            </div>
        </ul>
        
    </nav>
  )
}

export default Header
