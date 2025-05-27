import { useEffect, useState } from "react";
import { readEvents } from "../utility/crudUtility";
import { NavLink } from "react-router-dom";

const ArchivedEventsPage = () => {
	const [archivedEvents, setArchivedEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const unsubscribe = readEvents(
			(events) => {
				const archived = events.filter((event) => event.isActive === false);
				setArchivedEvents(archived);
				setLoading(false);
			},
			(err) => {
				setError(err);
				setLoading(false);
			},
		);

		return () => unsubscribe();
	}, []);

	if (loading) {
		return (
			<div className="mt-32 text-center text-white font-mono">
				Loading archived events...
			</div>
		);
	}

	if (error) {
		return (
			<div className="mt-32 text-center text-red-500 font-mono">
				Error loading archived events: {error.message}
			</div>
		);
	}

	return (
		<main className="font-mono flex flex-col justify-center items-center">
			{/* Header banner section */}
			<section
				style={{
					backgroundImage: `url("/Banner.jpg")`, // Use a default banner image
				}}
				className="relative min-h-[80vh] bg-cover bg-center bg-no-repeat bg-fixed w-full"
			>
				{/* Overlay with gradient similar to homepage */}
				<div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-tr from-gray-900/95 via-gray-900/70 to-transparent"></div>

				{/* Content container, centered */}
				<div className="relative mx-auto max-w-screen-xl px-4 py-24 sm:px-6 flex h-[80vh] items-center justify-center lg:px-8">
					<div className="max-w-2xl text-center space-y-8">
						<div className="space-y-4">
							{/* Title for Archived Events Page */}
							<h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
								<span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
									Archived
								</span>
								<strong className="block mt-3 text-3xl sm:text-5xl font-extrabold text-white">
									Events
								</strong>
							</h1>
							<p className="text-lg sm:text-xl text-gray-200 max-w-2xl leading-relaxed">
								Explore the history of Listopia's past events and winning lists!
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Main content for archived events grid */}
			<section className="container mx-auto p-6 pt-10">
				{" "}
				{/* Added pt-10 for spacing after banner */}
				{archivedEvents.length === 0 ? (
					<p className="text-gray-400 text-center text-lg">
						No archived events yet.
					</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{archivedEvents.map((event) => (
							<NavLink
								to={`/archivedEvents/${event.id}`}
								key={event.id}
								state={event}
								className="block" // Make the NavLink a block element for better card sizing
							>
								<article
									className="relative rounded-2xl overflow-hidden shadow-lg h-64 group transform hover:scale-105 transition-transform duration-300 ease-in-out" // Added hover effect
									style={{
										backgroundImage: `url(${event.eventImage || "/placeholder-event.jpg"})`, // Fallback for event image
										backgroundSize: "cover",
										backgroundPosition: "center",
									}}
								>
									<div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-70 transition-opacity duration-300" />{" "}
									{/* Darker hover overlay */}
									<div className="absolute bottom-0 p-4 text-white z-10">
										<header>
											<h3 className="text-2xl font-bold mb-1">{event.title}</h3>{" "}
											{/* Larger title */}
											<p className="text-base text-gray-200">
												{" "}
												{/* Adjusted text size */}
												Ended: {event.endDate.toDate().toLocaleDateString()}
											</p>
										</header>
									</div>
								</article>
							</NavLink>
						))}
					</div>
				)}
			</section>
		</main>
	);
};

export default ArchivedEventsPage;
