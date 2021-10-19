import { collection, getDocs } from "firebase/firestore/";
import { createContext, useEffect, useState } from "react";
import { db } from "../initFirebase";

export const FirestoreContext = createContext({ firestoreData: null });

export function FirestoreProvider({ children }) {
  const [firestoreData, setFirestoreData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const booksData = [];

      const querySnapshot = await getDocs(collection(db, "books"));
      querySnapshot.forEach(doc => {
        const object = JSON.parse(doc.data().json);
        booksData.push(object);
      });

      setFirestoreData(booksData);
    }
    fetchData();
  }, []);

  return <FirestoreContext.Provider value={{firestoreData}}>{children}</FirestoreContext.Provider>
};