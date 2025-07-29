import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

const useUserNotes = (user) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const notesRef = collection(db, "user", user.uid, "notes");
    const q = query(notesRef, orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedNotes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(fetchedNotes);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching notes:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { notes, loading };
};

export default useUserNotes;
