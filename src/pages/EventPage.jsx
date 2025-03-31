import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getActiveEvent, readEventLists } from "../utility/crudUtility";
import ListCard from "../components/ListCard";

const EventPage = () => {
	const { data, error, isLoading } = useQuery({
		queryKey: ["activeEvent"],
		queryFn: () => getActiveEvent(),
	});

	const {
		data: submittedLists,
		error: submittedError,
		isLoading: submittedLoading,
	} = useQuery({
		queryKey: ["submittedLists", data?.[0]?.id],
		queryFn: async () => {
			if (data?.[0]?.submitedLists?.length) {
				return await readEventLists(data[0].submitedLists);
			}
			return [];
		},
		enabled: !!data?.[0]?.submitedLists?.length,
	});

	if (isLoading || submittedLoading) return <div>Loading...</div>;
	if (error || submittedError) return <div>Error loading event.</div>;

	const eventEndDate = new Date(data?.[0]?.endDate.seconds * 1000);
	const currentDate = new Date();
	const daysRemaining = Math.ceil(
		(eventEndDate - currentDate) / (1000 * 3600 * 24),
	);

	const listsWithIds = submittedLists?.map((list, index) => ({
		...list,
		listId: data[0].submitedLists[index],
	}));

	const sortedLists = listsWithIds?.sort(
		(a, b) => b.likes.length - a.likes.length,
	);
	const topLists = sortedLists?.slice(0, 3);
	const remainingLists = sortedLists?.slice(3);

	return (
		<div className="mt-28 font-mono">
			{data?.length > 0 ? (
				<div className="text-center mb-20">
					<h1 className="text-4xl font-semibold text-rose-500 mb-5">
						<span className="text-black">Event title:</span> {data?.[0]?.title}
					</h1>
					<p className="italic mb-3">Description: {data?.[0]?.desc}</p>
					<div className="flex items-center justify-center gap-2">
						<span>{daysRemaining} Days Remaining</span>
					</div>
				</div>
			) : (
				<h1 className="text-center text-3xl">
					There is no active event at the moment.
				</h1>
			)}

			{topLists?.length > 0 && (
				<div className="mx-8 pb-6">
					<h2 className="text-2xl font-semibold text-center mb-6">
						Top 3 Most Liked Lists
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
						{topLists?.map((game) => (
							<div key={game.listId}>
								<ListCard
									description={game.desc}
									title={game.title}
									likes={game.likes}
									categories={game.categories}
									url={game.games[0]?.background_image}
									id={game.listId}
									username={game.username}
								/>
							</div>
						))}
					</div>
					<hr className="h-6" />
				</div>
			)}

			<div className="mx-8 pb-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
					{remainingLists?.map((game) => (
						<div key={game.listId}>
							<ListCard
								description={game.desc}
								title={game.title}
								likes={game.likes}
								categories={game.categories}
								url={game.games[0]?.background_image}
								id={game.listId}
								username={game.username}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default EventPage;
