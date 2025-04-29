import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import {
	getUser,
	readEventLists,
	validateAndCleanLikedListRef,
} from "../utility/crudUtility";
import { useQuery } from "@tanstack/react-query";
import ListCard from "../components/ListCard";
import { db } from "../utility/firebaseApp";
import { doc, getDoc } from "firebase/firestore";

const LikedLists = () => {
	const { user } = useContext(UserContext);
	const [userData, setUserData] = useState(null);

	const { data, error, isLoading } = useQuery({
		queryKey: ["likedLists", user?.uid],
		queryFn: async () => {
			if (userData?.likedLists?.length) {
				const validLists = [];

				for (const listId of userData.likedLists) {
					const listRef = doc(db, "Lists", listId);
					const listSnap = await getDoc(listRef);

					if (listSnap.exists()) {
						validLists.push({ ...listSnap.data(), listId: listSnap.id });
					} else {
						await validateAndCleanLikedListRef(user.uid, listId, "likedLists");
					}
				}

				return validLists;
			}
			return [];
		},
		enabled: !!userData?.likedLists,
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

	const sortedData = data
		? [...data].sort((a, b) => (b.likes_num || 0) - (a.likes_num || 0))
		: [];

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

export default LikedLists;
