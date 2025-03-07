import React, { useState } from "react";
import { motion } from "framer-motion";

const GameDetailModal = ({ id, user, game }) => {
    const modalId = `details_modal_${game.id}`;
    const [currentIndex, setCurrentIndex] = useState(0);

    // Remove the first screenshot
    const screenshots = game.short_screenshots?.slice(1) || [];

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            {/* Card that opens the modal */}
            <div
                key={game.id}
                className={`cursor-pointer group bg-white hover:bg-gray-50 border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200`}
                onClick={() => document.getElementById(modalId).showModal()}
            >
                <div className="flex flex-col sm:flex-row items-start gap-6">
                    <img
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

            {/* Modal */}
            <dialog
                id={modalId}
                className="modal rounded-md"
                onClick={(e) => {
                    const dialog = document.getElementById(modalId);
                    if (e.target === dialog) {
                        dialog.close();
                    }
                }}
            >
                <div className="modal-box p-6 rounded-xl relative">
                    {/* Banner */}
                    <div
                        className="bg-cover bg-center w-full h-48 flex justify-center items-center text-center p-4"
                        style={{ backgroundImage: `url(${game.background_image})` }}
                    >
                        <h3 className="font-bold sm:text-lg text-sm w-full text-white bg-black/50 p-2 rounded-lg">
                            {game.name}
                        </h3>
                    </div>

                    {/* Metacritic Score & Rating */}
                    <div className="text-center mt-4 flex justify-center gap-4">
                        <span className="bg-blue-500 text-white font-bold py-1 px-3 rounded-full">
                            Metacritic: {game.metacritic}
                        </span>
                        <span className="bg-rose-500 text-white font-bold py-1 px-3 rounded-full">
                            ⭐ {game.rating} / 5
                        </span>
                    </div>

                    {/* Available Platforms */}
                    <div className="text-center mt-4">
                        <h4 className="font-semibold text-gray-700">Available on:</h4>
                        <p className="text-gray-500">
                            {game.platforms?.map((platform) => platform.platform.name).join(", ")}
                        </p>
                    </div>

                    {/* Screenshot Carousel */}
                    <div className="mt-6 relative w-full max-w-md mx-auto">
                        <h3 className="font-bold text-lg mb-2 text-center">Screenshots</h3>

                        {/* Image Container */}
                        <div className="relative w-full h-48 overflow-hidden rounded-lg">
                            {screenshots.length > 0 ? (
                                <motion.img
                                    key={screenshots[currentIndex]?.id}
                                    src={screenshots[currentIndex]?.image}
                                    alt="screenshot"
                                    className="w-full h-full object-cover rounded-lg"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            ) : (
                                <p className="text-center text-gray-500">No screenshots available</p>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        {screenshots.length > 1 && (
                            <>
                                <button
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 font-bold bg-gray-800 text-white p-2 w-12 rounded-full hover:bg-gray-600 transition"
                                    onClick={prevSlide}
                                >
                                    {"<"}
                                </button>
                                <button
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 font-bold bg-gray-800 text-white p-2 w-12 rounded-full hover:bg-gray-600 transition"
                                    onClick={nextSlide}
                                >
                                    {">"}
                                </button>
                            </>
                        )}
                    </div>

                    <div className="modal-action flex gap-5 flex-col"></div>
                </div>
            </dialog>
        </>
    );
};

export default GameDetailModal;
