import React from 'react'
import EventCard from '../components/EventCard'

const Events = () => {
  return (
    <div className='mt-32 font-mono flex flex-col '>
      <h1 className='text-center text-3xl mb-10'>Submit your <span className='text-rose-600'>List</span> and be the winner!</h1>
      <form className='w-fit m-auto flex flex-col'>
        <div className='flex'>
          <label
            htmlFor="id"
            className="relative block overflow-hidden rounded-bl-md rounded-tl-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 text-slate-600 select-none"
          >
            <input
              type="text"
              id="id"
              placeholder="List id"
              className="peer h-8 w-fit  border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm text-slate-600 select-none"
            />

            <span
              className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs text-slate-600 select-none"
            >
              List id
            </span>
          </label>
          <button className="block rounded-br-md rounded-tr-md bg-rose-600 px-5 sm:px-10 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto" type='submit'>Submit</button>
        </div>
        <p className='text-xs italic mt-2'>*You can find your list id on the <span className='text-rose-600'>my lists</span> tab</p>
      </form>
      <hr  className='mt-10 w-96 m-auto border-rose-600 '/>
      <div className='m-10'>
        <h2 className='text-center text-xl'>Submitted lists</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mx-8 mt-8 pb-6'>
          {Array(6).fill(null).map((_, index) => (
            <EventCard key={index} />
          ))}
      </div>
      </div>
    </div>
  )
}

export default Events