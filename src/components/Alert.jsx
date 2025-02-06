import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Alert = ({ msg, err }) => {
  return (
    <AnimatePresence>
      {(msg || err) && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`fixed top-4 right-4 sm:top-20 sm:right-6 z-50 max-w-sm rounded-lg p-4 shadow-xl font-sans border-l-4 ${
            err 
              ? "bg-red-50 border-red-600" 
              : "bg-emerald-50 border-emerald-600"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`shrink-0 ${err ? "text-red-600" : "text-emerald-600"}`}>
              {err ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className={`text-sm font-medium ${
                err ? "text-red-800" : "text-emerald-800"
              }`}>
                {msg || err}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;