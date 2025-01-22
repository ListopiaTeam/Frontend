import React from 'react'

const Header = () => {
  return (
    <nav>
        <ul className='font-mono flex justify-between p-5 z-50 bg-stone-800/85 rounded-bl-lg rounded-br-lg px-4 shadow-xl text-slate-100 text-xl fixed top-0 left-0 w-full'>
            <div className='flex gap-8'>
                <li className='cursor-pointer'>Home</li>
                <li className='cursor-pointer'>Events</li>
                <li className='cursor-pointer'>Create list</li>
            </div>
            <div className='flex gap-8'>
                <li className='cursor-pointer'>Register</li>
                <li className='cursor-pointer'>Login</li>
            </div>
        </ul>
    </nav>
  )
}

export default Header
