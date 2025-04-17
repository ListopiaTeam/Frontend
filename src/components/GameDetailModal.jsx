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

			{/* Modal */}
			<dialog
				id={modalId}
				className="modal rounded-md w-2/3"
				onClick={(e) => {
					const dialog = document.getElementById(modalId);
					if (e.target === dialog) {
						dialog.close();
					}
				}}
			>
				<div className="modal-box p-6 rounded-xl relative">
					<div
						className="bg-cover bg-center w-full h-48 flex justify-center items-center text-center p-4"
						style={{ backgroundImage: `url(${game.background_image})` }}
					>
						<h3 className="font-bold sm:text-lg text-sm w-full text-white bg-black/50 p-2 rounded-lg">
							{game.name}
						</h3>
					</div>

					<div className="text-center mt-4 flex justify-center gap-4">
						<span className="bg-blue-500 text-white font-bold py-1 px-3 rounded-full">
							Metacritic Score: {game.metacritic}
						</span>
						<span className="bg-rose-500 text-white font-bold py-1 px-3 rounded-full">
							⭐ {game.rating} / 5
						</span>
					</div>

					<div className="text-center mt-4">
						<h4 className="font-semibold text-gray-700">Available on:</h4>
						<p className="text-gray-500">
							{game.platforms
								?.map((platform) => platform.platform.name)
								.join(", ")}
						</p>
					</div>

					<div className="mt-6 relative w-full max-w-md mx-auto">
						<h3 className="font-bold text-lg mb-2 text-center">Screenshots</h3>

						{screenshots.map((screenshot) => (
							<img
								loading="lazy"
								key={screenshot.image}
								className="hidden"
								src={screenshot.image}
							/>
						))}

						<div className=" w-full h-48 overflow-hidden rounded-lg">
							{screenshots.length > 0 ? (
								screenshots.map((screenshot) => (
									<motion.img
										loading="lazy"
										key={screenshot.id}
										src={screenshots[currentIndex]?.image}
										alt="screenshot"
										className={`w-full h-full object-cover rounded-lg`}
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.3 }}
									/>
								))
							) : (
								<p>There are no images available.</p>
							)}
						</div>

						{/* Navigation Buttons */}
						{screenshots.length > 1 && (
							<div className="flex justify-center gap-8 mt-8">
								<button
									className="font-bold text-2xl flex justify-center bg-rose-500 select-none  text-white p-2 w-12 rounded-full hover:bg-rose-600 transition"
									onClick={prevSlide}
								>
									<span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="18"
											height="18"
											fill="currentColor"
											className="bi bi-arrow-left font-bold"
											viewBox="0 0 16 16"
										>
											<path
												fillRule="evenodd"
												d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
												stroke="currentColor"
												strokeWidth="1"
											/>
										</svg>
									</span>
								</button>
								<button
									className="font-bold text-2xl flex justify-center bg-rose-500 select-none text-white p-2 w-12 rounded-full hover:bg-rose-600 transition"
									onClick={nextSlide}
								>
									<span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="18"
											height="18"
											fill="currentColor"
											className="bi bi-arrow-right"
											viewBox="0 0 16 16"
											stroke="currentColor"
											strokeWidth="1"
										>
											<path
												fillRule="evenodd"
												d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
											/>
										</svg>
									</span>
								</button>
							</div>
						)}
					</div>

					<div className="modal-action flex gap-5 flex-col"></div>
				</div>
			</dialog>
		</>
	);
};

export default GameDetailModal;
