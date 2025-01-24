import React from 'react'

const EventCard = () => {
  return (
    <a className="group relative block overflow-hidden ">

    <img
      src="https://images.unsplash.com/photo-1599481238640-4c1288750d7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2664&q=80"
      alt=""
      className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
    />

    <div className="relative border border-gray-100 bg-white p-6 font-mono ">
      <div className='flex gap-4'>
        <span className="whitespace-nowrap bg-rose-400 px-3 py-1.5 text-xs font-medium">FPS</span>
        <span className="whitespace-nowrap bg-rose-400 px-3 py-1.5 text-xs font-medium">MMORPG</span>
      </div>

      <h3 className="mt-4 text-lg font-medium text-gray-900">Best shooter games</h3>

      <p className="mt-1.5 text-sm text-gray-700"><b>Votes:</b> 0</p>

      <form className="mt-4 flex flex-col md:flex-row sm:gap-10 gap-4">
        <button
            className="block w-full rounded bg-rose-600 p-4 text-sm font-medium transition hover:scale-105"
        >
            View full list
        </button>
        <button
            className="block w-full rounded bg-sky-600 p-4 text-sm font-medium transition hover:scale-105"
        >
            Vote
        </button>
    </form>

    </div>
  </a>
  )
}

export default EventCard