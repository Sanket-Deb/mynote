"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db, provider } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { loginAndMigrateAnonNote } from "@/lib/migrateAnonNote";

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
  const [noteLoaded, setNoteLoaded] = useState(false);

  // Track user login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
    });
    return () => unsubscribe();
  }, []);

  // Load note from Firestore (but don't create)
  useEffect(() => {
    if (!id) return;

    const ref = user
      ? doc(db, "users", user.uid, "notes", id)
      : doc(db, "anon", id);

    setPathRef(ref);

    getDoc(ref).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setText(data.content || "");
        setPassword(data.password || "");
      }
      setNoteLoaded(true);
    });
  }, [id, user]);

  // Create or update on first edit
  const handleChange = async (e) => {
    const newText = e.target.value;
    setText(newText);

    if (!pathRef) return;

    const docSnap = await getDoc(pathRef);

    if (!docSnap.exists()) {
      await setDoc(pathRef, {
        content: newText,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        password: "",
      });
    } else {
      await updateDoc(pathRef, {
        content: newText,
        updatedAt: serverTimestamp(),
      });
    }
  };

  const handleSetCustomUrl = async () => {
    if (!customUrl.trim() || !pathRef) return;

    const newId = customUrl.trim();
    const newRef = user
      ? doc(db, "users", user.uid, "notes", newId)
      : doc(db, "anon", newId);

    const docSnap = await getDoc(pathRef);
    if (!docSnap.exists()) return;

    await setDoc(newRef, {
      ...docSnap.data(),
      updatedAt: serverTimestamp(),
    });

    await updateDoc(pathRef, { deleted: true }); // optional
    router.push(`/note/${newId}`);
  };

  const handleSetPassword = async () => {
    if (!pathRef) return;

    await updateDoc(pathRef, { password });
    alert("Password Set");
    setShowPasswordInput(false);
    setPassword("");
  };

  const handleLogin = async () => {
    try {
      const { user, migrated } = await loginAndMigrateAnonNote(id);
      if (migrated) {
        router.push(`/note/${id}`);
      } else {
        router.push("/home");
      }
    } catch (err) {
      console.error("Login or migration failed:", err);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/home");
  };

  return (
    <main className="bg-white min-h-screen p-4 text-black">
      <div className="flex justify-between items-center mb-4">
        {!user ? (
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Login with Google
          </button>
        ) : (
          <button
            onClick={handleBackToDashboard}
            className="bg-gray-600 text-white px-3 py-1 rounded"
          >
            Back to Dashboard
          </button>
        )}

        <div className="space-x-2">
          <button
            onClick={() => setShowUrlInput((prev) => !prev)}
            className="text-blue-500 underline text-sm"
          >
            Set Custom URL
          </button>
          <button
            onClick={() => setShowPasswordInput((prev) => !prev)}
            className="text-blue-500 underline text-sm"
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
            placeholder="Enter custom URL"
          />
          <button
            onClick={handleSetCustomUrl}
            className="bg-green-500 text-white px-4 py-1 rounded"
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
            className="bg-green-500 text-white px-4 py-1 rounded"
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

      {!noteLoaded ? (
        <p>Loading...</p>
      ) : (
        <textarea
          className="w-full h-[75vh] border rounded p-4 mt-4"
          value={text}
          onChange={handleChange}
          placeholder="Start writing your notes..."
        />
      )}
    </main>
  );
};

export default NotePage;
