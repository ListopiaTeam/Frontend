import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { readEventLists } from "../utility/crudUtility";
import ListCard from "../components/ListCard";

const ArchivedEventDetails = () => {
	const { state: eventData } = useLocation();
	console.log(eventData);

	const {
		data: submittedLists,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["archivedSubmittedLists", eventData?.id],
		queryFn: async () => {
			if (eventData?.submitedLists?.length) {
				return await readEventLists(eventData.submitedLists);
			}
			return [];
		},
		enabled: !!eventData?.submitedLists?.length,
	});

	if (!eventData) return <div>No event data provided.</div>;
	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error loading submitted lists.</div>;

	const eventEndDate = new Date(eventData.endDate.seconds * 1000);
	const listsWithIds = submittedLists?.length
		? submittedLists.map((list, index) => ({
				...list,
				listId: eventData.submitedLists[index],
		  }))
		: [];

	const sortedLists = [...listsWithIds].sort(
		(a, b) => b.likes.length - a.likes.length
	);

	const topLists = sortedLists.slice(0, 3);
	const remainingLists = sortedLists.slice(3);

	return (
		<div className="mt-32 font-mono flex flex-col justify-center items-center">
			<div className="text-center mb-20">
				<h1 className="text-4xl font-semibold text-rose-500 mb-5">
					<span className="text-black">Archived Event:</span> {eventData.title}
				</h1>
				<p className="italic mb-3">Description: {eventData.desc}</p>
				<p className="text-gray-600">Ended: {eventEndDate.toDateString()}</p>
			</div>

			{topLists?.length > 0 && (
				<div className="container flex flex-col justify-center mx-8 pb-6">
					<h2 className="text-2xl font-semibold text-center mb-6">
						Top 3 Most Liked Lists
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
						{topLists.map((game) => (
							<ListCard
								key={game.listId}
								description={game.desc}
								title={game.title}
								likes={game.likes}
								categories={game.categories}
								url={game.games[0]?.background_image}
								id={game.listId}
								username={game.username}
							/>
						))}
					</div>
					<hr className="h-6 mt-12" />
				</div>
			)}

			{remainingLists.length > 0 ? (
				<div className="container mx-8 pb-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
						{remainingLists.map((game) => (
							<ListCard
								key={game.listId}
								description={game.desc}
								title={game.title}
								likes={game.likes}
								categories={game.categories}
								url={game.games[0]?.background_image}
								id={game.listId}
								username={game.username}
							/>
						))}
					</div>
				</div>
			) : (
				<p className="text-center text-gray-500 italic pb-12">
					No lists were submited to this event.
				</p>
			)}
		</div>
	);
};

export default ArchivedEventDetails;
