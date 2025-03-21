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
} from "firebase/firestore";
import { db } from "./firebaseApp";


export const addList = async (formData, setList) => {
  const collectionRef = collection(db, "Lists");
  const newItem = { ...formData, timestamp: serverTimestamp() };

  const docRef = await addDoc(collectionRef, newItem);

  const itemWithId = { ...newItem, id: docRef.id };

  setList(docRef.id);
};

//dump file creation
export const generateSchema = async (collectionName) => {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);

  const schema = {};

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    Object.keys(data).forEach((key) => {
      const value = data[key];
      const type = Array.isArray(value)
        ? "array"
        : value === null
        ? "null"
        : typeof value;
      schema[key] = type; // Egyedi mezőnév és típus tárolása
    });
  });

  console.log("Schema:", schema);
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
      orderBy("timestamp", "desc")
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

export const toggleLike = async (id, uid) => {
  const docRef = doc(db, "Lists", id);
  const docSnap = await getDoc(docRef);
  const likesArr = docSnap.data().likes || [];
  if (likesArr.includes(uid)) {
    await updateDoc(docRef, { likes: likesArr.filter((p_id) => p_id != uid) });
  } else {
    await updateDoc(docRef, { likes: [...likesArr, uid] });
  }
};

export const addReport = async (listId, currentReport) => {
  console.log("THIS GOT CALLED FOR NO REASON");

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
  const docRef = doc(db, "Lists", id);

  try {
    // Get all subcollections of the document
    const subcollections = ["comments", "reports"]; // List all known subcollections

    for (const subcollection of subcollections) {
      const subCollectionRef = collection(db, "Lists", id, subcollection);
      const snapshot = await getDocs(subCollectionRef);

      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises); // Delete all documents in the subcollection
    }

    // Delete the parent document
    await deleteDoc(docRef);

    console.log(
      `Document with ID ${id} and its subcollections deleted successfully.`
    );
  } catch (error) {
    console.error("Error deleting document and subcollections:", error);
  }
};

export const deleteComment = async (listId, commentId) => {
  try {
    const commentsRef = collection(db, `Lists/${listId}/comments`);
    const repliesQuery = query(commentsRef, where("parentId", "==", commentId));
    const repliesSnapshot = await getDocs(repliesQuery);

    // Delete all replies
    const deleteRepliesPromises = repliesSnapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, `Lists/${listId}/comments`, docSnap.id))
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

export const fetchLists = async (listCount, selCateg, lastDoc) => {
  try {
    let listsQuery;

    if (selCateg.length === 0) {
      listsQuery = query(
        collection(db, "Lists"),
        orderBy("timestamp", "desc"),
        limit(listCount)
      );
    } else {
      listsQuery = query(
        collection(db, "Lists"),
        where("categories", "array-contains-any", selCateg),
        orderBy("timestamp", "desc"),
        limit(listCount)
      );
    }

    if (lastDoc) {
      listsQuery = query(listsQuery, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(listsQuery);

    if (querySnapshot.empty) {
      return { docs: [], lastDoc: null };
    }

    // Fetch the lists and include their reports
    const newLists = [];
    for (const docSnap of querySnapshot.docs) {
      const listData = docSnap.data();
      const listId = docSnap.id;

      // Fetch the reports subcollection for each list
      const reportsRef = collection(db, `Lists/${listId}/reports`);
      const reportsSnapshot = await getDocs(reportsRef);
      const reports = reportsSnapshot.docs.map((reportDoc) => reportDoc.data());

      // Push the list data along with the reports
      newLists.push({
        id: listId,
        ...listData,
        reports, // Include the reports subcollection data here
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

export const fetchUsers = async () => {
  try {
    const usersQuery = query(
      collection(db, "Users"),
      orderBy("createdAt", "desc")
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

export const readEvents = (setEvent, currentEvent) => {
  const collectionRef = collection(db, "Events");
  let q;
  q = query(collectionRef, orderBy("endDate", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    setList(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  });
  return unsubscribe;
};

export const addEvent = async (formData, setMsg) => {
  const collectionRef = collection(db, "Events");
  const q = query(collectionRef, where("isActive", "==", true));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    setMsg({ success: false, message: "An active event already exists." });
    return
  }else{
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
  const activeEventIds = querySnapshot.docs.map(doc => doc.id);
  
  setActiveEvent(activeEventIds)
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

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); 
};

//search for list based on title
export const searchListsByPrefix = async (prefix) => {
  const listsRef = collection(db, "Lists");
  const q = query(
    listsRef,
    where("title", ">=", prefix),
    where("title", "<=", prefix + "\uf8ff"),
    orderBy("title")
  );

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error searching for lists:", error);
    return [];
  }
};
