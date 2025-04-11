import {
	addDoc,
	arrayUnion,
	collection,
	deleteDoc,
	doc,
	DocumentSnapshot,
	getDoc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
	limit,
	startAfter,
	arrayRemove,
	increment,
} from "firebase/firestore";
import { db } from "./firebaseApp";

export const addList = async (formData, setList, user) => {
	const collectionRef = collection(db, "Lists");
	const newItem = { ...formData, timestamp: serverTimestamp() };

	const docRef = await addDoc(collectionRef, newItem);

	const itemWithId = { ...newItem, id: docRef.id };

	console.log(docRef.id);

	setList(docRef.id);

	const userRef = doc(db, "Users", user);
	await setDoc(
		userRef,
		{
			createdLists: arrayUnion(docRef.id),
		},
		{ merge: true },
	);
};



export const readList = (setList, selCateg) => {
	const collectionRef = collection(db, "Lists");
	console.log("Selected Categories:", selCateg);
	let q;
	if (selCateg.length === 0) {
		q = query(collectionRef, orderBy("timestamp", "desc"));
	} else {
		q = query(
			collectionRef,
			where("categories", "array-contains-any", selCateg),
			orderBy("timestamp", "desc"),
		);
	}
	const unsubscribe = onSnapshot(q, (snapshot) => {
		setList(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
	});
	return unsubscribe;
};

export const readLists = async (id) => {
	return new Promise((resolve) => {
		const docRef = doc(db, "Lists", id);
		const unsubscribe = onSnapshot(docRef, (snapshot) => {
			resolve({ ...snapshot.data(), id: snapshot.id });
		});
		return unsubscribe;
	});
};
export const readEventLists = async (ids) => {
	if (!ids || ids.length === 0) {
		console.log("No submitted lists to fetch.");
		return [];
	}

	try {
		const listsPromises = ids.map((id) => getDoc(doc(db, "Lists", id)));
		const listsDocs = await Promise.all(listsPromises);

		const lists = listsDocs
			.map((docSnapshot) => {
				if (docSnapshot.exists()) {
					return { ...docSnapshot.data(), listId: docSnapshot.id }; // Attach the document ID
				} else {
					console.log(`No document found for ID: ${docSnapshot.id}`);
					return null;
				}
			})
			.filter((data) => data !== null);

		if (lists.length === 0) {
			console.log("No lists found for the provided IDs.");
		}

		return lists;
	} catch (error) {
		console.error("Error fetching event lists:", error);
		return [];
	}
};
export const toggleLike = async (id, uid) => {
	const docRef = doc(db, "Lists", id);
	const docSnap = await getDoc(docRef);
	const likesArr = docSnap.data().likes || [];
	const likesNum = docSnap.data().likes_num || 0;
  
	console.log("Current likes:", likesNum);
  
	const userRef = doc(db, "Users", uid);

	if (likesArr.includes(uid)) {
	  const updatedLikesArr = likesArr.filter((p_id) => p_id !== uid);
	  const updatedLikesNum = Math.max(likesNum - 1, 0);
  
	  await updateDoc(docRef, {
		likes: updatedLikesArr,
		likes_num: updatedLikesNum,
	  });
	  await updateDoc(userRef, { likedLists: arrayRemove(id) });
	} else {
	  const updatedLikesArr = [...likesArr, uid];
	  const updatedLikesNum = likesNum + 1;
  
	  await updateDoc(docRef, {
		likes: updatedLikesArr,
		likes_num: updatedLikesNum,
	  });
	  await updateDoc(userRef, { likedLists: arrayUnion(id) });
	}
  };
  

export const addReport = async (listId, currentReport) => {
	const reportsRef = collection(db, `Lists/${listId}/reports`);
	const q = query(reportsRef, where("userId", "==", currentReport.userId));
	const querySnapshot = await getDocs(q);

	if (!querySnapshot.empty) {
		return true;
	}
	await addDoc(reportsRef, currentReport);

	return false;
};

export const addComment = async (listId, newComment) => {
	const commentRef = doc(collection(db, `Lists/${listId}/comments`));
	try {
		await setDoc(commentRef, newComment);
		console.log("Comment added with ID:", commentRef.id);
	} catch (error) {
		console.error("Error adding comment:", error);
	}
};

export const listenToComments = (listId, setComments) => {
	const commentsRef = collection(db, `Lists/${listId}/comments`);
	const q = query(commentsRef, orderBy("timestamp", "desc"));
	return onSnapshot(q, (snapshot) => {
		const comments = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		setComments(comments);
	});
};
export const deleteList = async (id) => {
    try {
        try {
            const eventIds = await getActiveEventIds();
            if (eventIds?.length > 0) {
                const eventId = eventIds[0];
                const eventDocRef = doc(db, "Events", eventId);
                const eventSnapshot = await getDoc(eventDocRef);

                if (eventSnapshot.exists()) {
                    const eventData = eventSnapshot.data() || {};
                    const submittedLists = Array.isArray(eventData.submitedLists) 
                        ? eventData.submitedLists 
                        : [];
                    
                    if (submittedLists.includes(id)) {
                        await updateDoc(eventDocRef, {
                            submitedLists: submittedLists.filter(listId => listId !== id)
                        });
                        console.log(`Removed list ${id} from event ${eventId}`);
                    }
                }
            }
        } catch (eventError) {
            console.warn("Couldn't update event (proceeding with deletion):", eventError);
        }

   
        const listRef = doc(db, "Lists", id);
        

        await Promise.allSettled(["comments", "reports"].map(async (subcol) => {
            try {
                const subColRef = collection(db, "Lists", id, subcol);
                const snapshot = await getDocs(subColRef);
                await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)));
            } catch (subColError) {
                console.warn(`Couldn't delete ${subcol} subcollection:`, subColError);
            }
        }));

        
        await deleteDoc(listRef);
        console.log(`List ${id} fully deleted`);

    } catch (mainError) {
        console.error("Critical deletion error:", mainError);
        throw mainError; 
    }
};

export const deleteComment = async (listId, commentId) => {
	try {
		const commentsRef = collection(db, `Lists/${listId}/comments`);
		const repliesQuery = query(commentsRef, where("parentId", "==", commentId));
		const repliesSnapshot = await getDocs(repliesQuery);

		// Delete all replies
		const deleteRepliesPromises = repliesSnapshot.docs.map((docSnap) =>
			deleteDoc(doc(db, `Lists/${listId}/comments`, docSnap.id)),
		);
		await Promise.all(deleteRepliesPromises);
		// Delete the main comment
		await deleteDoc(doc(db, `Lists/${listId}/comments`, commentId));

		console.log(`Deleted comment ${commentId} and its replies`);
	} catch (error) {
		console.error("Error deleting comment and replies: ", error);
	}
};

export const getUser = async (userId) => {
	try {
		const userRef = doc(db, "Users", userId);
		const userSnap = await getDoc(userRef);

		if (userSnap.exists()) {
			return userSnap.data();
		} else {
			console.log("No such user found!");
			return null;
		}
	} catch (error) {
		// console.error("Error fetching user:", error);
		return null;
	}
};

export const fetchLists = async (listCount, selCateg, selOrderType, lastDoc) => {
	try {
		let listsQuery;
		let order;
		
		selOrderType == "title_lowercase" ? order = "asc" : order = "desc";

		if (selCateg.length === 0) {
			listsQuery = query(
				collection(db, "Lists"),
				orderBy(selOrderType, order),
				limit(listCount),
			);
		} else {
			listsQuery = query(
				collection(db, "Lists"),
				where("categories", "array-contains-any", selCateg),
				orderBy(selOrderType, order),
				limit(listCount),
			);
		}

		if (lastDoc) {
			listsQuery = query(listsQuery, startAfter(lastDoc));
		}

		const querySnapshot = await getDocs(listsQuery);

		if (querySnapshot.empty) {
			return { docs: [], lastDoc: null };
		}

		const newLists = [];
		for (const docSnap of querySnapshot.docs) {
			const listData = docSnap.data();
			const listId = docSnap.id;

			newLists.push({
				id: listId,
				...listData,
			});
		}

		const lastDocRef = querySnapshot.docs[querySnapshot.docs.length - 1];

		return {
			docs: newLists,
			lastDoc: lastDocRef || null,
		};
	} catch (error) {
		console.error("Error fetching lists:", error);
		return { docs: [], lastDoc: null };
	}
};

export const getReportedLists = async () => {
	try {
		const listsQuery = query(
			collection(db, "Lists"),
			orderBy("timestamp", "desc"),
		);

		const querySnapshot = await getDocs(listsQuery);

		if (querySnapshot.empty) {
			return { docs: [], lastDoc: null };
		}

		const newLists = [];

		for (const docSnap of querySnapshot.docs) {
			const listId = docSnap.id;
			const { title, desc } = docSnap.data();

			// console.log(listData);

			// Fetch reports
			const reportsRef = collection(db, `Lists/${listId}/reports`);
			const reportsSnapshot = await getDocs(reportsRef);
			const reports = reportsSnapshot.docs.map((reportDoc) => reportDoc.data());

			newLists.push({
				id: listId,
				reports,
				listData: { title, desc },
			});
		}

		return {
			docs: newLists,
		};
	} catch (error) {
		console.error("Error fetching lists:", error);
		return { docs: [], lastDoc: null };
	}
};

export const fetchUsers = async () => {
	try {
		const usersQuery = query(
			collection(db, "Users"),
			orderBy("createdAt", "desc"),
		);

		const querySnapshot = await getDocs(usersQuery);

		return {
			docs: querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})),
			lastDoc: null,
		};
	} catch (error) {
		console.error("Error fetching users:", error);
		return { docs: [], lastDoc: null };
	}
};

export const readEvents = (setEvent) => {
	const collectionRef = collection(db, "Events");
	let q;
	q = query(collectionRef, orderBy("endDate", "desc"));

	const unsubscribe = onSnapshot(q, (snapshot) => {
		setEvent(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
	});
	return unsubscribe;
};

export const addEvent = async (formData, setMsg) => {
	const collectionRef = collection(db, "Events");
	const q = query(collectionRef, where("isActive", "==", true));
	const querySnapshot = await getDocs(q);

	if (!querySnapshot.empty) {
		setMsg({ success: false, message: "An active event already exists." });
		return;
	} else {
		const newItem = { ...formData };
		await addDoc(collectionRef, newItem);
		setMsg({ success: true, message: "Event added successfully." });
	}
};

//get active eventid
export const getActiveEventIds = async (setActiveEvent) => {
	const eventsRef = collection(db, "Events");
	const q = query(eventsRef, where("isActive", "==", true));
	const querySnapshot = await getDocs(q);
	const activeEventIds = querySnapshot.docs.map((doc) => doc.id);
	if (setActiveEvent) {
		setActiveEvent(activeEventIds);
	} else {
		return activeEventIds;
	}
};

export const addListToEvent = async (listId, eventId) => {
	const docRef = doc(db, "Events", eventId);

	try {
		await updateDoc(docRef, {
			submitedLists: arrayUnion(listId),
		});
	} catch (error) {
		console.error("Error updating list:", error);
	}
};

export const getActiveEvent = async () => {
	const eventsRef = collection(db, "Events");
	const q = query(eventsRef, where("isActive", "==", true));

	const querySnapshot = await getDocs(q);
	if (querySnapshot.empty) {
		return null;
	}

	return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

//search for list based on title
export const searchListsByPrefix = async (prefix) => {
	const listsRef = collection(db, "Lists");
	const q = query(listsRef, orderBy("title"));

	try {
		const querySnapshot = await getDocs(q);
		const filteredLists = querySnapshot.docs
			.map((doc) => ({
				id: doc.id,
				...doc.data(),
				titleLowercase: doc.data().title.toLowerCase(),
			}))
			.filter(
				(doc) => doc.titleLowercase.includes(prefix.toLowerCase()), // Changed from startsWith to includes
			);

		return filteredLists;
	} catch (error) {
		console.error("Error searching for lists:", error);
		return [];
	}
};

//resolve reports based on listID

export const resolveReports = async (listId) => {
	const reportsRef = collection(db, `Lists/${listId}/reports`);
	const snapshot = await getDocs(reportsRef);

	const deletePromises = snapshot.docs.map((docSnap) =>
		deleteDoc(doc(db, `Lists/${listId}/reports`, docSnap.id))
	);

	await Promise.all(deletePromises);

	return false;
};
