import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 z-50 left-4 sm:right-6 md:bottom-12 lg:left-8">
    <button
        className="inline-block w-12 h-12 rounded-full bg-rose-600 p-2 cursor-pointer text-white transition-all duration-300 transform hover:bg-rose-500 hover:shadow-md hover:scale-110 sm:p-3 lg:p-4 shadow-lg shadow-rose-400/50"
        onClick={() => navigate(-1)}
    >
        <span className="sr-only">Go back</span>
        <b>{"<"}</b>
    </button>
    </div>
  );
};

export default GoBackButton;
