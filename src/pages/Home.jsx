import React from "react";
import Event from "../components/Event";
import ListCard from "../components/ListCard";
import { useQuery } from "@tanstack/react-query";
import { fetchLists } from "../utility/crudUtility";

const Home = () => {
	const selCateg = [];

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["infiniteLists"],
		queryFn: () => fetchLists(3, selCateg, "likes_num", null),
		select: (data) =>
			data?.docs?.sort((a, b) => b.likes.length - a.likes.length) || [],
	});

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (isError) {
		return <p>Error: {error.message}</p>;
	}

	if (!data || data.length === 0) {
		return <p>No lists found.</p>;
	}

	return (
		<>
			<Event />
			<div className="flex flex-col container m-auto">
				<h2 className="text-center text-slate-800 font-semibold text-xl font-mono mt-8">
					Top rated lists
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 mt-8 pb-6">
					{data.slice(0, 3).map((list) => (
						<div key={list.id}>
							<ListCard
								description={list.desc}
								title={list.title}
								likes={list.likes}
								categories={list.categories}
								url={list.games[0]?.background_image}
								id={list.id}
							/>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default Home;
