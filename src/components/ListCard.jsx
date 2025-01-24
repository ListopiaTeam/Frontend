import React, { useState } from 'react';

const ListCard = () => {
  const [favorited, setFavorited] = useState(false);

  const favoriteList = () => setFavorited(prev => !prev);

  return (
    <a className="group relative block overflow-hidden ">
      <button
        onClick={favoriteList}
        className="absolute end-4 top-4 z-10 rounded-full bg-white p-1.5 text-gray-900 transition hover:text-gray-900/75"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={favorited ? "yellow" : "none"}
          stroke={favorited ? "yellow" : "currentColor"}
          strokeWidth="1.5"
          className="size-6"
        >
          <path
            d="M12 2L14.09 8.26H20.18L15.91 11.74L17.27 18L12 14.74L6.73 18L8.09 11.74L3.82 8.26H9.91L12 2Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

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

        <p className="mt-1.5 text-sm text-gray-700"><b>Rating:</b> 4.3 / 5</p>

        <form className="mt-4">
          <button
            className="block w-full rounded bg-rose-600 p-4 text-sm font-medium transition hover:scale-105"
          >
            View full list
          </button>
        </form>
      </div>
    </a>
  );
}

export default ListCard;
