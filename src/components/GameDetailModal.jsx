import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const GameDetailModal = ({ id, user, game }) => {
  const modalId = `details_modal_${game.id}`;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState([]);
  
  const screenshots = game.short_screenshots?.slice(1) || [];

  // Preload all screenshots
  useEffect(() => {
    const preloadImages = () => {
      const imagePromises = screenshots.map((screenshot) => {
        const img = new Image();
        img.src = screenshot.image;
        return new Promise((resolve) => {
          img.onload = resolve;
        });
      });

      Promise.all(imagePromises).then(() => {
        setPreloadedImages(screenshots);
      });
    };

    preloadImages();
  }, [screenshots]);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? screenshots.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === screenshots.length - 1 ? 0 : prev + 1
    );
  };

  const handleSwipe = (e, info) => {
    if (info.offset.x < -50) {
      nextSlide();
    } else if (info.offset.x > 50) {
      prevSlide();
    }
  };

  return (
    <>
      {/* Trigger Card */}
      <div
        key={game.id}
        className="cursor-pointer group bg-white hover:bg-gray-50 border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
        onClick={() => document.getElementById(modalId).showModal()}
      >
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {game.background_image && (
            <img
              loading="lazy"
              src={game.background_image}
              alt={game.name}
              className="sm:w-32 h-32 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
              {game.name}
            </h3>
            <div className="mt-2 flex items-center flex-wrap gap-4 text-gray-600">
              {typeof game.rating === "number" && (
                <p className="flex items-center gap-1">
                  ⭐
                  <span className="font-medium">
                    {game.rating}
                    <span className="text-gray-400 ml-1">/5</span>
                  </span>
                </p>
              )}
              {game.released && (
                <p className="flex items-center gap-1">
                  <span className="text-gray-500">
                    Released: {new Date(game.released).toLocaleDateString()}
                  </span>
                </p>
              )}
            </div>
            {game.stores?.length > 0 && (
              <>
                <span className="font-bold">Available at:</span>
                <ul className="flex flex-wrap gap-2 list-none text-gray-700">
                  {game.stores.map((s) => (
                    <li
                      key={s.store.id}
                      className="px-3 py-1 bg-gray-200 rounded-full text-sm transition-transform hover:scale-105"
                    >
                      {s.store.name}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <dialog
        id={modalId}
        className="backdrop:bg-black/50 rounded-lg m-auto"
        onClick={(e) => {
          const dialog = document.getElementById(modalId);
          if (e.target === dialog) dialog.close();
        }}
      >
        <div className="p-0 max-w-4xl rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Column - Visuals */}
            <div className="bg-gray-100 p-6">
              {game.background_image && (
                <div className="relative aspect-video rounded-lg bg-black">
                  <img
                    src={game.background_image}
                    alt={game.name}
                    className="h-full w-full"
                  />
                </div>
              )}

              {screenshots.length > 0 && (
                <div className="mt-6 bg-gray-200 p-2 rounded-lg flex flex-col items-center">
                  <h3 className="font-semibold text-lg mb-3">Screenshots</h3>

                  <div className="flex justify-center items-stretch rounded-lg overflow-hidden">
                    <button
                      onClick={prevSlide}
                      className="px-2 bg-white flex items-center justify-center rounded-l-lg hover:bg-rose-500 transition-all"
                    >
                      ❮
                    </button>

                    <div className="bg-white flex items-center justify-center">
                      {preloadedImages.length > 0 && (
                        <motion.img
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          onDragEnd={handleSwipe}
                          key={currentIndex}
                          src={preloadedImages[currentIndex]?.image}
                          alt={`Screenshot ${currentIndex + 1}`}
                          className="h-full object-cover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </div>

                    <button
                      onClick={nextSlide}
                      className="px-2 bg-white flex items-center justify-center rounded-r-lg hover:bg-rose-500 transition-all"
                    >
                      ❯
                    </button>
                  </div>

                  <div className="flex justify-center mt-3 gap-1">
                    {screenshots.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          currentIndex === index
                            ? "bg-rose-500"
                            : "bg-gray-400 hover:bg-rose-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Game Info */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{game.name}</h2>
                  {game.released && (
                    <p className="text-gray-500 text-lg">
                      Released: {new Date(game.released).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => document.getElementById(modalId).close()}
                  className="btn btn-sm btn-ghost px-1 font-bold hover:text-rose-700"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {game.metacritic && (
                  <span className="badge badge-lg bg-black text-white p-2 rounded-full">
                    Metacritic: {game.metacritic}
                  </span>
                )}
                {typeof game.rating === "number" && (
                  <span className="badge badge-lg bg-amber-500 text-black p-2 rounded-full">
                    Rating: {game.rating.toFixed(2)}/5
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {game.platforms?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Platforms</h3>
                    <ul className="flex flex-wrap gap-2 list-none text-gray-700">
                      {game.platforms.map((p) => (
                        <li
                          key={p.platform.id}
                          className="px-3 py-1 bg-gray-200 rounded-full text-sm transition-transform hover:scale-105"
                        >
                          {p.platform.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {game.stores?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Stores</h3>
                    <ul className="flex flex-wrap gap-2 list-none text-gray-700">
                      {game.stores.map((s) => (
                        <li
                          key={s.store.id}
                          className="px-3 py-1 bg-gray-200 rounded-full text-sm transition-transform hover:scale-105"
                        >
                          {s.store.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {game.genres?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Genres</h3>
                    <ul className="flex flex-wrap gap-2 list-none text-gray-700">
                      {game.genres.map((genre, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 bg-rose-100 text-rose-500 rounded-full text-sm font-medium transition-transform hover:scale-105"
                        >
                          {genre.name}
                        </li>
                      ))}
                    </ul>
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
