import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-100">
  <div className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-24">
    <div className="absolute end-4 top-4 sm:end-6 sm:top-6 lg:end-8 lg:top-8">
      <a
        className="inline-block rounded-full bg-rose-600 p-2 cursor-pointer text-white shadow transition hover:bg-rose-500 sm:p-3 lg:p-4"
        onClick={() => window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })}
      >
        <span className="sr-only">Back to top</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      </a>
    </div>

    <div className="lg:flex lg:items-end lg:justify-between">
      <div>
        <div className="flex justify-center text-rose-600 lg:justify-start">
          <img src="Listopia_Icon_v2_big.png" alt="graphic design is my passion" />
        </div>

        <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500 lg:text-left font-mono">
          Listopia is a social platform for gamers to share lists of their favorite games.
        </p>
      </div>
    </div>

    <p className="mt-12 text-center text-sm text-gray-500 lg:text-right font-mono">
      Copyright &copy; {new Date().getFullYear()}. All rights reserved. Made By ListopiaTeam and RAWG API.
    </p>
  </div>
</footer>
)
}

export default Footer