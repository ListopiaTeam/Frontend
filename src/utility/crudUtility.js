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
} from "firebase/firestore";
import { db } from "./firebaseApp";
import { getAuth } from "firebase/auth";

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

export const readLists = async (id, setList) => {
  const docRef = doc(db, "Lists", id);
  const unsubscribe = onSnapshot(docRef, (snapshot) => {
    setList({ ...snapshot.data(), id: snapshot.id });
  });
  return unsubscribe;
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
    console.log(comments);
    setComments(comments);
  });
};

export const deleteList = async (id) => {
  const docRef = doc(db, "Lists", id);
  await deleteDoc(docRef);
};

export const deleteComment = async (listId, id) => {
  const commentRef = doc(db, `Lists/${listId}/comments`, id);
  await deleteDoc(commentRef);
};

export const getUser = async (userId) => {
  try {
    const userRef = doc(db, "Users", userId); 
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log("User Data:", userSnap.data());
      return userSnap.data();
    } else {
      console.log("No such user found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};