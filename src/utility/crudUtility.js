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

export const addList = async (formData) => {
  const collectionRef = collection(db, "Lists");
  const newItem = { ...formData, timestamp: serverTimestamp() };
  await addDoc(collectionRef, newItem);
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
    return unsubscribe
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
  await deleteDoc(docRef);
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
      listsQuery = query(listsQuery, startAfter(lastDoc)); // Fetch after the last document
    }

    const querySnapshot = await getDocs(listsQuery);

    if (querySnapshot.empty) {
      return { docs: [], lastDoc: null };
    }

    const newLists = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

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

