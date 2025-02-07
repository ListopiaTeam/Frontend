import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

const ListCard = () => {
  const [isLiked, setIsLiked] = useState(false)
  const [voteCount, setVoteCount] = useState(0)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setVoteCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  return (
    <article className="group relative h-full overflow-hidden rounded-2xl bg-white shadow-lg shadow-gray-100/40 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50">
  
      <div className="relative aspect-[5/3] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1599481238640-4c1288750d7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2664&q=80"
          alt="Game cover"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
   
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-800 backdrop-blur-sm">
            FPS
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-800 backdrop-blur-sm">
            MMORPG
          </span>
        </div>
      </div>


      <div className="p-5">
  
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-gray-900 truncate pr-2">Epic Fantasy Adventure Game</h3>
          <button 
            onClick={handleLike}
            className="flex items-center gap-1.5 group transition-colors"
            aria-label={isLiked ? "Remove like" : "Like this game"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 transition-all ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-gray-900 fill-transparent stroke-current stroke-[2px]'}`}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className={`text-sm font-medium ${isLiked ? 'text-rose-500' : 'text-gray-500'}`}>
              {voteCount}
            </span>
          </button>
        </div>


        <div className="mt-3 mb-4">
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            Embark on an epic journey through magical realms filled with ancient creatures 
            and forgotten lore. Team up with friends in this massive multiplayer RPG 
            featuring stunning visuals and dynamic combat.
          </p>
        </div>

   
     
          <NavLink to={'/details/' + "ZKQxUE5H15kwnxGZmG2q"} className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-rose-700 hover:gap-3">
            View Details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2" 
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </NavLink>
      </div>
    </article>
  )
}

export default ListCard