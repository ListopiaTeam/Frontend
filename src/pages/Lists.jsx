import React, { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ListCard from "../components/ListCard";
import { getTags } from "../utility/rawgAPI";
import {
	fetchLists,
	getActiveEvent,
	searchListsByPrefix,
} from "../utility/crudUtility";

const Lists = () => {
	const [selCateg, setSelCateg] = useState([]);
	const [categoriesSelectionIsOpen, setCategoriesSelectionIsOpen] =
		useState(false);
	const [gameQuery, setGameQuery] = useState("");
	const [triggerSearch, setTriggerSearch] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [isCategoryOpen, setIsCategoryOpen] = useState(false);

	const {
		data: tags,
		isLoading: loadingTags,
		isError: errorTags,
		error,
	} = useQuery({
		queryKey: ["tags"],
		queryFn: () => getTags(),
	});

	const {
		data: lists,
		isFetching,
		hasNextPage,
		fetchNextPage,
		isLoading,
		isError,
	} = useInfiniteQuery({
		queryKey: ["topLists", selCateg],
		queryFn: ({ pageParam = null }) => fetchLists(5, selCateg, pageParam),

		getNextPageParam: (lastPage) => {
			if (!lastPage?.lastDoc) return undefined;
			return lastPage.lastDoc;
		},

		initialData: {
			pages: [],
			pageParams: [],
		},

		onError: (error) => {
			console.error("Error fetching lists:", error);
		},
	});

	// Handle scroll event for lazy loading
	const handleScroll = useCallback(() => {
		if (isFetching || !hasNextPage) return;
		if (
			window.innerHeight + window.scrollY >=
			document.body.offsetHeight - 100
		) {
			fetchNextPage();
		}
	}, [isFetching, hasNextPage, fetchNextPage]);

	useEffect(() => {
		window.scrollTo(window.top);
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	const toggleCategory = (category) => {
		setSelCateg((prev) =>
			prev.includes(category)
				? prev.filter((c) => c !== category)
				: [...prev, category],
		);
	};

	const {
		data: searchedGames,
		error: searchError,
		isLoading: searchIsLoading,
	} = useQuery({
		queryKey: ["games", gameQuery],
		queryFn: () => searchListsByPrefix(gameQuery),
		enabled: triggerSearch && gameQuery.length > 0,
	});

	const searchGame = () => {
		if (gameQuery.length > 0) {
			setTriggerSearch(true);
		}
	};

	useEffect(() => {
		setTriggerSearch(false);
	}, [searchedGames]);

	useEffect(() => {
		console.log("Tags data updated:", tags);
	}, [tags]);

	return (
		<div className="mt-32 mx-8 pb-6">
			<div className="mb-8">
				<div className="flex flex-wrap gap-4 items-end">
					{/* Search Input */}
					<div className="flex-1 min-w-[300px]">
						<label className="block text-gray-700 text-sm font-bold mb-2">
							Search Lists:
						</label>
						<div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1 shadow-sm focus-within:border-rose-600 focus-within:ring-1 focus-within:ring-rose-600">
							<input
								type="text"
								className="w-full border-none outline-none p-2 text-gray-900 placeholder-gray-400"
								placeholder="Search for a game"
								onChange={(e) => setGameQuery(e.target.value)}
								value={gameQuery}
								onKeyDown={(e) => e.key === "Enter" && searchGame()}
							/>
							<button
								onClick={() => searchGame()}
								className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
							>
								Search
							</button>
						</div>
					</div>

					{/* Category Selector */}
					<div className="flex-1 min-w-[300px]">
						<label className="block text-gray-700 text-sm font-bold mb-2">
							Select Categories:
						</label>
						<div className="relative">
							<button
								onClick={() => setIsCategoryOpen(!isCategoryOpen)}
								className="w-full p-3 bg-white border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400"
							>
								<span className="truncate">
									{selectedCategories.length > 0
										? `${selectedCategories.length} selected`
										: "All Categories"}
								</span>
								<span
									className={`ml-2 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
								>
									▼
								</span>
							</button>

							{isCategoryOpen && (
								<div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
									<div className="p-2 text-sm text-gray-500 border-b">
										Select categories:
									</div>
									<div className="divide-y">
										{tags?.map((category, index) => (
											<label
												key={category}
												className={`flex items-center p-3 space-x-3 cursor-pointer hover:bg-rose-300 ${selectedCategories.includes(category) ? "bg-rose-50" : ""} ${index % 2 == 0 ? "bg-rose-100" : ""}`}
											>
												<input
													type="checkbox"
													checked={selCateg.includes(category)}
													onChange={() => toggleCategory(category)}
													className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
												/>
												<span className="flex-1 text-gray-700">{category}</span>
											</label>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{isLoading ||
				(searchIsLoading && (
					<p className="text-center text-gray-600">Loading...</p>
				))}
			{isError ||
				(searchError && (
					<p className="text-center text-rose-600">Error loading lists!</p>
				))}
			{!lists?.pages?.length && (
				<p className="text-rose-600 text-center text-xl font-semibold">
					No list available for the selected category!
				</p>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8">
				{searchedGames ? (
					searchedGames.length === 0 ? (
						<div className="col-span-full text-center">
							<p className="text-rose-600 text-xl font-semibold">
								No lists found.
							</p>
						</div>
					) : (
						searchedGames.map((game) => (
							<div key={game.id}>
								<ListCard
									description={game.desc}
									title={game.title}
									likes={game.likes}
									categories={game.categories}
									url={game.games[0]?.background_image}
									id={game.id}
									username={game.username}
								/>
							</div>
						))
					)
				) : lists?.pages?.length === 0 ||
				  lists?.pages?.every((page) => page.docs?.length === 0) ? (
					<div className="col-span-full text-center">
						<p className="text-rose-600 text-xl font-semibold">
							No list available for the selected category!
						</p>
					</div>
				) : (
					lists?.pages?.map((page) =>
						page?.docs?.map((list) => (
							<div key={list.id}>
								<ListCard
									description={list.desc}
									title={list.title}
									likes={list.likes}
									categories={list.categories}
									url={list.games[0]?.background_image}
									id={list.id}
									username={list?.username}
								/>
							</div>
						)),
					)
				)}
			</div>
			{isFetching && (
				<p className="text-center text-gray-600">Loading more...</p>
			)}
		</div>
	);
};

export default Lists;
