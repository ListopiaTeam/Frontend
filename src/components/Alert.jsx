import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Alert = ({ msg, err }) => {
  return (
    <AnimatePresence>
      {(msg || err) && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }} 
          transition={{ duration: 0.3 }}
          className={`fixed top-20 sm:right-2 right-0 rounded-xl p-4 shadow-lg font-mono ${
            err ? "bg-red-600" : "bg-green-600"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="mt-1 text-sm text-slate-100 font-semibold">
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
