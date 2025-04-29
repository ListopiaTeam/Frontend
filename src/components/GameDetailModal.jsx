import React, { useState } from "react";
import { motion } from "framer-motion";

const GameDetailModal = ({ id, user, game }) => {
  const modalId = `details_modal_${game.id}`;
  const [currentIndex, setCurrentIndex] = useState(0);

  const screenshots = game.short_screenshots?.slice(1) || [];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Original card/button (unchanged) */}
      <div
        key={game.id}
        className={`cursor-pointer group bg-white hover:bg-gray-50 border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200`}
        onClick={() => document.getElementById(modalId).showModal()}
      >
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <img
            loading="lazy"
            src={game.background_image}
            alt={game.name}
            className="w-full sm:w-32 h-32 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
              {game.name}
            </h3>
            <div className="mt-2 flex items-center flex-wrap gap-4 text-gray-600">
              <p className="flex items-center gap-1">
                ⭐
                <span className="font-medium">
                  {game.rating}
                  <span className="text-gray-400 ml-1">/5</span>
                </span>
              </p>
              {game.released && (
                <p className="flex items-center gap-1">
                  <span className="text-gray-400">Released:</span>
                  <span className="font-medium">
                    {new Date(game.released).toLocaleDateString()}
                  </span>
                </p>
              )}
            </div>
            <p>
              <span className="font-bold">Available at:</span>{" "}
              {game.stores?.map((store) => store.store.name).join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Centered, rounded modal */}
      <dialog
        id={modalId}
        className="modal modal-middle backdrop:bg-black/50"
        onClick={(e) => {
          const dialog = document.getElementById(modalId);
          if (e.target === dialog) dialog.close();
        }}
      >
        <div className="modal-box p-0 max-w-4xl rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Column - Visuals */}
            <div className="bg-gray-100 p-6">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {screenshots.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-3">Screenshots</h3>
                  <div className="relative">
                    <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-200">
                      {screenshots.length > 0 ? (
                        <motion.img
                          key={currentIndex}
                          src={screenshots[currentIndex]?.image}
                          alt={`Screenshot ${currentIndex + 1}`}
                          className="w-full h-full object-contain"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No screenshots available
                        </div>
                      )}
                    </div>
                    {screenshots.length > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-2 top-1/2 -translate-y-1/2 btn btn-sm btn-circle bg-white/90 shadow"
                          aria-label="Previous screenshot"
                        >
                          ❮
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-sm btn-circle bg-white/90 shadow"
                          aria-label="Next screenshot"
                        >
                          ❯
                        </button>
                        <div className="flex justify-center mt-3 gap-1">
                          {screenshots.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentIndex(index)}
                              className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-rose-500' : 'bg-gray-300'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{game.name}</h2>
                <button
                  onClick={() => document.getElementById(modalId).close()}
                  className="btn btn-sm btn-ghost"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {game.metacritic && (
                  <span className="badge badge-lg bg-blue-600 border-none text-white">
                    Metacritic: {game.metacritic}
                  </span>
                )}
                <span className="badge badge-lg bg-amber-500 border-none text-white">
                  Rating: {game.rating?.toFixed(1)}/5
                </span>
                {game.released && (
                  <span className="badge badge-lg bg-gray-200 border-none text-gray-800">
                    Released: {new Date(game.released).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Platforms</h3>
                  <p className="text-gray-700">
                    {game.platforms?.map(p => p.platform.name).join(", ")}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Stores</h3>
                  <p className="text-gray-700">
                    {game.stores?.map(s => s.store.name).join(", ")}
                  </p>
                </div>
                {game.genres?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Genres</h3>
                    <p className="text-gray-700">
                      {game.genres.map(g => g.name).join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default GameDetailModal;
