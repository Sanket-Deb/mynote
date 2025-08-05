import { db } from "./firebase";
import {
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

// For logged-in users
export const createUserNote = async (uid) => {
  const docRef = await addDoc(collection(db, "users", uid, "notes"), {
    content: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    password: "",
  });
  return docRef.id;
};

// For non-logged-in user
export const createAnonNote = async (noteId) => {
  const noteRef = doc(db, "anon", noteId);
  await setDoc(noteRef, {
    content: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    password: "",
  });
  return noteId;
};

//---------unsed
// Update content (used in autosave)
export const updateNoteContent = async (ref, content) => {
  await updateDoc(ref, {
    content,
    updatedAt: serverTimestamp(),
  });
};

// Delete any note (used by dashboard delete)
export const deleteNote = async (ref) => {
  await deleteDoc(ref);
};

// Get full note document
export const getNote = async (ref) => {
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};
