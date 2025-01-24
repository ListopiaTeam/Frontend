import React from 'react'
import {NavLink} from 'react-router'

const Login = () => {
  return (
    <div className="mt-32 flex justify-center">
      <form action="" className='max-w-lg m-auto gap-5 flex flex-col mx-5'>
        <h2 className='text-center text-3xl font-semibold'>Login</h2>
            <label
            htmlFor="UserEmail"
            className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 text-slate-600 select-none"
            >
            <input
                type="email"
                id="UserEmail"
                placeholder="Email"
                className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm text-slate-600 select-none"
            />

            <span
                className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs text-slate-600 select-none"
            >
                Email
            </span>
            </label>
            
            <label
            htmlFor="password"
            className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 text-slate-600 select-none"
            >
            <input
                type="password"
                id="password"
                placeholder="Password"
                className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm text-slate-600 select-none"
            />

            <span
                className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs text-slate-600 select-none"
            >
                Password
            </span>
            </label>
            <button className="block rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto" type='submit'>Login</button>
            <p className="text-center mb-5">Don't have an account yet? <NavLink className="text-rose-600" to="/register">Register</NavLink></p>
        </form>
    </div>
  )
}

export default Login