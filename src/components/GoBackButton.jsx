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
              <span className="sr-only">Back to top</span>
              <svg className='size-5' fill='currentColor' viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <text x="50%" y="50%" font-size="16" fontWeight="bold" text-anchor="middle" dominant-baseline="middle" font-family="Arial">
                  &lt;
                </text>
              </svg>
            </a>
          </motion.div>
      </AnimatePresence>
    )
};

export default GoBackButton;
