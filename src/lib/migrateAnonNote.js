import { auth, db, provider } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";

export const loginAndMigrateAnonNote = async (noteId) => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const noteRef = doc(db, "notes", noteId);
  const noteSnap = await getDoc(noteRef);

  if (noteSnap.exists()) {
    const data = noteSnap.data();

    if (!data.ownerUID) {
      await updateDoc(noteRef, {
        ownerUID: user.uid,
        migratedFromAnon: true,
      });
      return { user, migrated: true };
    }
    return { user, migrated: false };
  }
  return { user, migrated: false };
};
