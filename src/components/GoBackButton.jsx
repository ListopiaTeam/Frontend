import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GoBackButton = () => {
  const navigate = useNavigate()

  return (
      <AnimatePresence>
          <motion.div
            className="fixed bottom-6 z-50 left-4 sm:right-6 md:bottom-12 lg:right-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.25 }}
          >
            <a
              className="inline-block rounded-full bg-rose-600 p-2 cursor-pointer text-white transition-all duration-300 transform hover:bg-rose-500 hover:shadow-md hover:scale-110 sm:p-3 lg:p-4 shadow-lg shadow-rose-400/50"
              onClick={() =>
                navigate(-1)
              }
            >
              <span className="sr-only">Go back</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-left font-bold" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" stroke="currentColor" strokeWidth="1"/>
              </svg>
            </a>
          </motion.div>
      </AnimatePresence>
    )
};

export default GoBackButton;
