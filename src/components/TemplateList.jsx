import React from 'react'

const TemplateList = () => {
  return (
  <div className="group relative block overflow-hidden shadow-xl border border-black">
    <div className="relative w-full h-48 bg-gray-300 flex items-center justify-center select-none">
      <span className="absolute text-white text-3xl font-bold text-center">Image Is Made After Games Are Selected</span>
    </div>
    <div className="relative border border-gray-100 bg-white p-6">
      <div className="flex gap-4">
        <span className="whitespace-nowrap bg-rose-400 px-3 py-1.5 text-xs font-mono font-medium cursor-pointer select-none hover:bg-rose-500">SELECT TAGS</span>
      </div>
      <div className="flex flex-col">
        <input className="mt-4 text-lg font-mono font-bold text-gray-900 placeholder:text-gray-800 border-bottom-1 outline-none" type="text" id='title' placeholder='Edit List Title (35)' maxLength={35} onChange={(e)=>e.target.value.length == 35 ? alert("Title too long (Max 35 Characters)") : ""}/>
        <hr />
        <textarea style={{minHeight:"5rem", height:"10rem", maxHeight:"15rem"}} className="mt-4 text-md font-medium text-gray-900 placeholder:text-gray-800 border-bottom-1 outline-none" type="text" id='description' placeholder='Edit List Description (200)' maxLength={200} onChange={(e)=>e.target.value.length == 200 ? alert("Description too long (Max 200 Characters)") : ""}/>
      </div>
    </div>
  </div>
  )
}

export default TemplateList