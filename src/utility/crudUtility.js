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

  