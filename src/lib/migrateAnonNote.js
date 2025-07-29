import { auth, db, provider } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";

export const loginAndMigrateAnonNote = async (noteId) => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const anonRef = doc(db, "anon", noteId);
  const anonSnap = await getDoc(anonRef);

  if (anonSnap.exists()) {
    const data = anonSnap.data();
    const userRef = doc(db, "users", user.uid, "notes", noteId);
    await setDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
      migrateFromAnon: true,
    });

    await deleteDoc(anonRef);
    return { user, migrated: true };
  } else {
    return { user, migrated: false };
  }
};
