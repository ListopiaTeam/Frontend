import React, { useState, useEffect } from 'react'

const ScrollTop = () => {
    const [verticalScrollBar, setVerticalScrollBar] = useState(null)
    
    useEffect(() => {
        const checkScrollBar = () => {
            setVerticalScrollBar(document.documentElement.scrollHeight > document.documentElement.clientHeight);
        };

        checkScrollBar();
    }, [document.documentElement.scrollHeight]);

    console.log(verticalScrollBar);
    
  return (
    verticalScrollBar && (
        <div className="fixed bottom-4 z-50 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8">
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
    )
  )
}

export default ScrollTop