import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const ScrollTopButton = () => {
	const [showButton, setShowButton] = useState(false);
	const [verticalScrollBar, setVerticalScrollBar] = useState(
		document.body.clientHeight > window.innerHeight,
	);
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
			if (window.scrollY > 100) {
				// Button only appears after certain amount of scrolling
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
									behavior: "smooth",
								})
							}
						>
							<span className="sr-only">Back to top</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								fill="currentColor"
								className="bi bi-arrow-up"
								viewBox="0 0 16 16"
							>
								<path
									fillRule="evenodd"
									d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
									stroke="currentColor"
									strokeWidth="1"
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
