import { db } from "./firebase";
import {
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { nanoid } from "nanoid";

export const createUserNote = async (uid) => {
  const docRef = await addDoc(collection(db, "users", uid, "notes"), {
    content: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    password: "",
  });
  return docRef.id;
};

export const createAnonNote = async (uid) => {
  const noteRef = await doc(db, "anon", uid, noteId);
  await setDoc(noteRef, {
    content: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    password: "",
  });
};

// Update content (used in autosave)
export const updateNoteContent = async (pathRef, content) => {
  await updateDoc(pathRef, {
    content,
    updatedAt: serverTimestamp(),
  });
};

// Delete any note (used by dashboard delete)
export const deleteNote = async (pathRef) => {
  await deleteDoc(pathRef);
};

// Get full note document
export const getNote = async (pathRef) => {
  const snap = await getDoc(pathRef);
  return snap.exists() ? snap.data() : null;
};
