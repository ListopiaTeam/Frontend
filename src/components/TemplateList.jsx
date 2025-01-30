import React from 'react'

const TemplateList = () => {
  return (
  <a className="group relative block overflow-hidden shadow-xl border border-black">
    <div className="relative w-full h-48 bg-gray-300 flex items-center justify-center cursor-pointer">
      <img src="" alt="Image" className="w-full h-full object-cover hidden" onError={(e) => e.target.style.display = 'none'}/>
      <span className="absolute text-white text-3xl font-bold">Select An Image</span>
    </div>
    <div className="relative border border-gray-100 bg-white p-6 font-mono">
      <div className="flex gap-4">
        <span className="whitespace-nowrap bg-rose-400 px-3 py-1.5 text-xs font-medium cursor-pointer">SELECT TAGS</span>
      </div>
      <input className="mt-4 text-lg font-medium text-gray-900 placeholder:text-gray-800 border-bottom-1 outline-none" type="text" placeholder='Enter your list title '/>
    </div>
  </a>
  )
}

export default TemplateList