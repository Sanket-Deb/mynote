"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createUserNote } from "@/lib/firestoreHelpers";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) {
        router.push("/");
      } else {
        setUser(u);
      }
    });
    return () => unsub();
  }, [router]);

  // Load notes in real-time
  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "notes");

    const unsub = onSnapshot(ref, (snap) => {
      const notesList = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredNotes = notesList.filter(
        (note) =>
          note.ownerUID === user.uid && note.content?.trim() && !note.deleted
      );

      setNotes(filteredNotes);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  // New note handler via helper
  const handleNewNote = async () => {
    try {
      const noteId = await createUserNote(user.uid);
      router.push(`/note/${noteId}`);
    } catch (err) {
      console.error("Error creating note:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <main className="p-6 bg-white min-h-screen text-black">
      {user && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Welcome, {user.displayName || user.email}
              </h2>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>

          <div className="flex justify-end mb-4">
            <button
              onClick={handleNewNote}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + New Note
            </button>
          </div>

          {loading ? (
            <p>Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="text-gray-500">
              No notes yet. Click {`"New Note"`} to start.
            </p>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="border rounded p-4 hover:shadow flex flex-col justify-between"
                >
                  <div
                    onClick={() => router.push(`/note/${note.id}`)}
                    className="cursor-pointer"
                  >
                    <p className="text-gray-700 mb-2">
                      {note.content?.substring(0, 100) || "Empty note..."}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created on:{" "}
                      {note.createdAt?.toDate
                        ? note.createdAt.toDate().toLocaleString()
                        : "—"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Last updated:{" "}
                      {note.updatedAt?.toDate
                        ? note.updatedAt.toDate().toLocaleString()
                        : "—"}
                    </p>
                  </div>

                  <button
                    onClick={async (e) => {
                      e.stopPropagation(); // prevent routing
                      const confirmed = confirm("Delete this note?");
                      if (confirmed) {
                        const ref = doc(db, "notes", note.id);
                        await deleteDoc(ref);
                      }
                    }}
                    className="mt-0.5 bg-red-500 text-white px-3 py-1 rounded text-sm self-end"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default HomePage;
