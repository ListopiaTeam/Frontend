import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
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

export const readLists = async (id, setList) => {
  const docRef = doc(db, "Lists", id);
  const unsubscribe = onSnapshot(docRef, (snapshot) => {
    setList({ ...snapshot.data(), id: snapshot.id });
  });
  return unsubscribe;
};
