import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { getUser, readEventLists } from "../utility/crudUtility";
import { useQuery } from "@tanstack/react-query";
import ListCard from "../components/ListCard";

const MyLists = () => {
	const { user } = useContext(UserContext);
	const [userData, setUserData] = useState(null);

	const { data, error, isLoading } = useQuery({
		queryKey: ["myLists"],
		queryFn: async () => {
			if (userData?.createdLists?.length) {
				return await readEventLists(userData?.createdLists);
			}
			return [];
		},
		enabled: !!userData?.createdLists,
	});

	useEffect(() => {
		const fetchData = async () => {
			const data = await getUser(user.uid);
			setUserData(data);
		};

		if (user) {
			fetchData();
		}
	}, [user]);

	if (!userData) {
		return <div>Loading...</div>;
	}

	if (isLoading) {
		return <div>Loading lists...</div>;
	}

	if (error) {
		return <div>Error loading lists: {error.message}</div>;
	}

	// Sort by newer lists first
	const sortedData = data ? [...data].sort((a, b) => b.timestamp - a.timestamp) : [];

	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8">
				{sortedData.map((game, index) => (
					<div key={index}>
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
	);		
};

export default MyLists;
