import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { readEventLists } from "../utility/crudUtility";
import ListCard from "../components/ListCard";

const ArchivedEventDetails = () => {
	const location = useLocation();
	const eventData = location.state;

	// Handle case where eventData is not passed via state (e.g., direct access)
	// You might want to implement fetching event data by ID from the URL if this is a common scenario.
	if (!eventData) {
		return (
			<div className="mt-32 text-center text-white font-mono">
				No event data provided. Please navigate from the Archived Events list.
			</div>
		);
	}

	const {
		data: submittedLists = [],
		error,
		isLoading,
	} = useQuery({
		queryKey: ["archivedSubmittedLists", eventData.id],
		queryFn: async () => {
			if (
				Array.isArray(eventData.submitedLists) &&
				eventData.submitedLists.length > 0
			) {
				return await readEventLists(eventData.submitedLists);
			}
			return [];
		},
		enabled: !!eventData.submitedLists?.length,
	});

	if (isLoading)
		return (
			<div className="mt-32 text-center text-white font-mono">
				Loading lists for {eventData.title}...
			</div>
		);
	if (error)
		return (
			<div className="mt-32 text-center text-red-500 font-mono">
				Error loading submitted lists: {error.message}
			</div>
		);

	const eventEndDate = new Date(
		eventData.endDate?.seconds * 1000 || Date.now(),
	);

	const listsWithIds = submittedLists.map((list, index) => ({
		...list,
		listId: eventData.submitedLists[index],
	}));

	const sortedLists = listsWithIds.sort(
		(a, b) => (b.likes?.length || 0) - (a.likes?.length || 0),
	);
	const topLists = sortedLists.slice(0, 3);
	const remainingLists = sortedLists.slice(3);

	return (
		<main className="font-mono flex flex-col justify-center items-center">
			{/* Header banner section */}
			<section
				style={{
					backgroundImage: `url(${eventData.eventImage || "/Banner.jpg"})`, // Use event image or fallback
				}}
				className="relative min-h-[80vh] bg-cover bg-center bg-no-repeat bg-fixed w-full"
			>
				{/* Overlay with gradient similar to homepage */}
				<div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-tr from-gray-900/95 via-gray-900/70 to-transparent"></div>

				{/* Content container, centered */}
				<div className="relative mx-auto max-w-screen-xl px-4 py-24 sm:px-6 flex h-[80vh] items-center justify-center lg:px-8">
					<div className="max-w-2xl text-center space-y-8">
						<div className="space-y-4 text-wrap">
							{/* Event Title */}
							<h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
								<span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
									Archived Event:
								</span>
								<strong className="block mt-3 text-3xl sm:text-5xl font-extrabold text-white">
									{eventData.title}
								</strong>
							</h1>
							{/* Event Description */}
							<p className="text-lg sm:text-xl text-gray-200 max-w-2xl leading-relaxed">
								{eventData.desc}
							</p>
						</div>

						{/* Event Ended Date, styled similarly to homepage's clock icon part */}
						<div className="mt-12 flex items-center justify-center gap-4 text-gray-300 text-sm">
							<div className="flex items-center gap-2 text-xl sm:text-2xl font-semibold">
								{" "}
								{/* Larger text for prominence */}
								<svg
									className="w-6 h-6 text-rose-400" // Increased size
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>Event Ended: {eventEndDate.toDateString()}</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Main content for lists */}
			{topLists.length > 0 && (
				<section className="container flex flex-col justify-center mx-8 pt-10 pb-6">
					<h2 className="text-2xl font-semibold text-center mb-6 text-black">
						{" "}
						{/* Changed text color */}
						Top 3 Most Liked Lists
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
						{topLists.map((game) => (
							<article key={game.listId}>
								<ListCard
									description={game.desc}
									title={game.title}
									likes={game.likes}
									categories={game.categories}
									url={game.games?.[0]?.background_image}
									id={game.listId}
									username={game.username}
								/>
							</article>
						))}
					</div>
					<hr className="h-6 mt-12 border-gray-300" />{" "}
					{/* Changed border color */}
				</section>
			)}

			{submittedLists.length === 0 ? (
				<footer className="pt-10 pb-12">
					{" "}
					{/* Added pt-10 for spacing after banner */}
					<p className="text-center text-gray-400 italic text-lg">
						{" "}
						{/* Adjusted text color and size */}
						No lists were submitted to this event.
					</p>
				</footer>
			) : remainingLists.length > 0 ? (
				<section className="container mx-8 pb-6 pt-6 -mt-6">
					{" "}
					{/* Added pt-6 for consistency */}
					<h2 className="text-2xl font-semibold text-center mb-6 text-black">
						Remaining Lists
					</h2>{" "}
					{/* Added title and changed text color */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
						{remainingLists.map((game) => (
							<article key={game.listId}>
								<ListCard
									description={game.desc}
									title={game.title}
									likes={game.likes}
									categories={game.categories}
									url={game.games?.[0]?.background_image}
									id={game.listId}
									username={game.username}
								/>
							</article>
						))}
					</div>
				</section>
			) : null}
		</main>
	);
};

export default ArchivedEventDetails;
