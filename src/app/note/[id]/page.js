"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const NotePage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [text, setText] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [password, setPassword] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [user, setUser] = useState(null);
  const [pathRef, setPathRef] = useState(null);

  // Check auth status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
    });
    return () => unsubscribe();
  }, []);

  // Load note from Firestore (anon or user path)
  useEffect(() => {
    if (!id) return;

    const noteRef = user
      ? doc(db, "users", user.uid, "notes", id)
      : doc(db, "anon", id);

    setPathRef(noteRef);

    getDoc(noteRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setText(data.content || "");
        setPassword(data.password || "");
      } else {
        // New note: create it
        setDoc(noteRef, {
          content: "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          password: "",
        });
      }
    });
  }, [id, user]);

  // Autosave on text change
  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    if (pathRef) {
      updateDoc(pathRef, {
        content: newText,
        updatedAt: serverTimestamp(),
      });
    }
  };

  // Handle custom URL rename
  const handleSetCustomUrl = async () => {
    if (!customUrl.trim() || !pathRef) return;

    const newId = customUrl.trim();
    const newPathRef = user
      ? doc(db, "users", user.uid, "notes", newId)
      : doc(db, "anon", newId);

    const docSnap = await getDoc(pathRef);
    if (!docSnap.exists()) return;

    await setDoc(newPathRef, {
      ...docSnap.data(),
      updatedAt: serverTimestamp(),
    });

    await updateDoc(pathRef, { deleted: true }); // optional soft-delete flag
    router.push(`/note/${newId}`);
  };

  // Handle password save
  const handleSetPassword = async () => {
    if (!pathRef) return;

    await updateDoc(pathRef, { password });
    alert("Password Set");
    setShowPasswordInput(false);
    setPassword("");
  };

  return (
    <main className="bg-white min-h-screen p-4 text-black">
      <div className="flex justify-between items-center mb-4">
        {!user ? (
          <button
            onClick={() => alert("Google login coming soon!")}
            className="bg-blue-400 text-white px-3 py-1 rounded"
          >
            Login with Google
          </button>
        ) : (
          <div className="text-gray-500 text-sm">Logged in as {user.email}</div>
        )}

        <div className="space-x-2">
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-blue-400 underline text-sm"
          >
            Set Custom URL
          </button>
          <button
            onClick={() => setShowPasswordInput(!showPasswordInput)}
            className="text-blue-400 underline text-sm"
          >
            Set Password
          </button>
        </div>
      </div>

      {showUrlInput && (
        <div className="mb-2">
          <input
            className="border p-2 w-full mb-2"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Enter URL of your choice"
          />
          <button
            onClick={handleSetCustomUrl}
            className="bg-green-400 text-white px-4 py-1 rounded"
          >
            Save URL
          </button>
          <button
            onClick={() => setShowUrlInput(false)}
            className="bg-red-400 text-white px-4 py-1 rounded ml-2"
          >
            Close
          </button>
        </div>
      )}

      {showPasswordInput && (
        <div className="mb-2">
          <input
            className="border p-2 w-full mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a password"
          />
          <button
            onClick={handleSetPassword}
            className="bg-green-400 text-white px-4 py-1 rounded"
          >
            Set Password
          </button>
          <button
            onClick={() => setShowPasswordInput(false)}
            className="bg-red-400 text-white px-4 py-1 rounded ml-2"
          >
            Close
          </button>
        </div>
      )}

      <textarea
        className="w-full h-[75vh] border rounded p-4 mt-4"
        value={text}
        onChange={handleChange}
        placeholder="Start writing your notes..."
      />
    </main>
  );
};

export default NotePage;
