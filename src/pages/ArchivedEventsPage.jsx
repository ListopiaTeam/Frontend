import { useEffect, useState } from "react";
import { readEvents } from "../utility/crudUtility";
import { NavLink } from "react-router-dom";

const ArchivedEventsPage = () => {
	const [archivedEvents, setArchivedEvents] = useState([]);

	useEffect(() => {
		const unsubscribe = readEvents((events) => {
			const archived = events.filter((event) => event.isActive === false);
			setArchivedEvents(archived);
		});

		return () => unsubscribe();
	}, []);

	return (
		<main className="mt-24 p-6">
			<header>
				<h2 className="text-2xl text-center font-bold font-mono mb-6">
					Archived Events
				</h2>
			</header>
			<section>
				{archivedEvents.length === 0 ? (
					<p className="text-gray-500">No archived events yet.</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{archivedEvents.map((event) => (
							<NavLink
								to={`/archivedEvents/${event.id}`}
								key={event.id}
								state={event}
							>
								<article
									className="relative rounded-2xl overflow-hidden shadow-lg h-64 group"
									style={{
										backgroundImage: `url(${event.eventImage})`,
										backgroundSize: "cover",
										backgroundPosition: "center",
									}}
								>
									<div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-60 transition" />

									<div className="absolute bottom-0 p-4 text-white z-10">
										<header>
											<h3 className="text-xl font-semibold">{event.title}</h3>
											<p className="text-sm">
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
