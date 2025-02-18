import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const ScrollTopButton = () => {
  const [showButton, setShowButton] = useState(false);
  const [verticalScrollBar, setVerticalScrollBar] = useState(document.body.clientHeight > window.innerHeight);
  const location = useLocation(); // React Router hook to detect page changes

  useEffect(() => {
    const checkScrollBar = () => {
      setVerticalScrollBar(document.body.clientHeight > window.innerHeight);
    };

    const resizeObserver = new ResizeObserver(() => {
      checkScrollBar();
    });

    resizeObserver.observe(document.body);

    window.addEventListener("resize", checkScrollBar);

    // Initial check
    checkScrollBar();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", checkScrollBar);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) { // Button only appears after certain amount of scrolling
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Hide button when the route changes
  useEffect(() => {
    setShowButton(false);
  }, [location]);

  return (
    verticalScrollBar && (
      <AnimatePresence>
        {showButton && (
          <motion.div
            className="fixed bottom-6 z-50 right-4 sm:right-6 md:bottom-12 lg:right-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.25 }}
          >
            <a
              className="inline-block rounded-full bg-rose-600 p-2 cursor-pointer text-white transition-all duration-300 transform hover:bg-rose-500 hover:shadow-md hover:scale-110 sm:p-3 lg:p-4 shadow-lg shadow-rose-400/50"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }
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
          </motion.div>
        )}
      </AnimatePresence>
    )
  );
};

export default ScrollTopButton;
