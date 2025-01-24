import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="relative mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 md:gap-10">
          <img className="w-24 h-24" src="Listopia_Icon_v2_big.png" alt="graphic design is my passion" />
          <p className=" max-w-md leading-relaxed text-gray-500 text-left font-mono ">
            Listopia is a social platform for gamers to share lists of their favorite games.
          </p>
        </div>

        <p className="mt-12 text-center text-sm text-gray-500 lg:text-right font-mono">
          Copyright &copy; {new Date().getFullYear()}. All rights reserved. Made By ListopiaTeam and RAWG API.
        </p>
      </div>
    </footer>
  )
}

export default Footer