import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getActiveEvent, readEventLists } from "../utility/crudUtility";
import ListCard from "../components/ListCard";
import { useQueryClient } from "@tanstack/react-query";

const EventPage = () => {
	const { data, error, isLoading } = useQuery({
		queryKey: ["activeEvent"],
		queryFn: () => getActiveEvent(),
	});

	const queryClient = useQueryClient();

	useEffect(() => {
		const id = data?.[0]?.id;
		if (id) {
			queryClient.removeQueries({
				queryKey: ["submittedLists", id],
				exact: true,
			});
		}
	}, [data?.[0]?.id, queryClient]);

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

	if (isLoading || submittedLoading)
		return <div className="mt-32 text-center text-white">Loading...</div>;
	if (error || submittedError)
		return (
			<div className="mt-32 text-center text-red-500">Error loading event.</div>
		);

	const eventEndDate = new Date(data?.[0]?.endDate.seconds * 1000);
	const currentDate = new Date();
	const daysRemaining = Math.ceil(
		(eventEndDate - currentDate) / (1000 * 3600 * 24),
	);

	let listsWithIds;
	if (submittedLists?.length > 0) {
		listsWithIds = submittedLists?.map((list, index) => ({
			...list,
			listId: data[0].submitedLists[index],
		}));
	}

	const sortedLists = listsWithIds?.sort(
		(a, b) => b.likes.length - a.likes.length,
	);

	const topLists = sortedLists?.slice(0, 3);
	const remainingLists = sortedLists?.slice(3);
	
	return (
		<main className="font-mono flex flex-col justify-center items-center">
			{data?.length > 0 ? (
				<section
					style={{
						backgroundImage: `url(${data?.[0]?.eventImage || "Banner.jpg"})`,
					}}
					
					className="relative min-h-[80vh] bg-cover bg-center bg-no-repeat bg-fixed w-full"
				>
			
					<div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-tr from-gray-900/95 via-gray-900/70 to-transparent"></div>

					
					<div className="relative mx-auto max-w-screen-xl px-4 py-24 sm:px-6 flex h-[80vh] items-center justify-center lg:px-8">
						<div className="max-w-2xl text-center space-y-8">
							<div className="space-y-4">
					
								<h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
									<span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
										{data?.[0]?.title}
									</span>
							
									{data?.[0]?.desc && (
										<strong className="block mt-3 text-3xl sm:text-5xl font-extrabold text-white">
											{data?.[0]?.desc}
										</strong>
									)}
								</h1>
							
								{!data?.[0]?.desc && (
									<p className="text-lg sm:text-xl text-gray-200 max-w-2xl leading-relaxed">
										Discover the best lists submitted for this event!
									</p>
								)}
							</div>

					
							{data?.[0].endDate && (
								<div className="mt-12 flex items-center justify-center gap-4 text-gray-300 text-sm">
									<div className="flex items-center gap-2 text-xl sm:text-2xl font-semibold">
										{" "}
							
										<svg
											className="w-6 h-6 text-rose-400" 
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
										<span>
											{daysRemaining <= 0
												? "Event Ended"
												: `${daysRemaining} Day(s) Remaining`}
										</span>
									</div>
								</div>
							)}
						</div>
					</div>
				</section>
			) : (
				<section className="mt-32 text-center p-8">
					<h1 className="text-3xl text-rose-500">
						There is no active event at the moment.
					</h1>
				</section>
			)}

			{topLists?.length > 0 && (
				<section className="container flex flex-col justify-center mx-8 pt-10 pb-6">
					<h2 className="text-2xl font-semibold text-center mb-6 text-black">
						Top 3 Most Liked Lists
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
						{topLists?.map((game) => (
							<article key={game.listId}>
								<ListCard
									description={game.desc}
									title={game.title}
									likes={game.likes}
									categories={game.categories}
									url={game.games[0]?.background_image}
									id={game.listId}
									username={game.username}
								/>
							</article>
						))}
					</div>

					   {remainingLists?.length > 0 && (
					<hr className="h-6 mt-12 border-gray-300" />
					)}
				</section>
			)}

			{submittedLists?.length === 0 ? (
				<footer className="pt-10 pb-12">
					{" "}
					
					<p className="text-center text-gray-400 italic text-lg">
						{" "}
					
						No lists were submitted to this event.
					</p>
				</footer>
			) : remainingLists.length > 0 ? (
				<section className="container mx-8 pb-6 pt-6 -mt-6">
					<h2 className="text-2xl font-semibold text-center mb-6 text-black">
						Remaining Lists
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
						{remainingLists?.map((game) => (
							<article key={game.listId}>
								<ListCard
									description={game.desc}
									title={game.title}
									likes={game.likes}
									categories={game.categories}
									url={game.games[0]?.background_image}
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

export default EventPage;
