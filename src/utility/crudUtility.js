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
    console.log(selCateg);
    const q =
      selCateg.length == 0
        ? query(collectionRef, orderBy("timestamp", "desc"))
        : query(collectionRef, where("category", "in", selCateg));
  
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

  