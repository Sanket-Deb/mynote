"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const router = useRouter();

  // Load saved note
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(stored);
  }, []);

  const handleNewNote = () => {
    const id = nanoid(6);
    const newNote = {
      id,
      content: "",
      lastModified: new Date().toISOString(),
    };

    const updated = [newNote, ...notes];
    localStorage.setItem("notes", JSON.stringify(updated));
    router.push(`/note/${id}`);
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">📒 Your Notes</h1>
      <button
        onClick={handleNewNote}
        className="bg-blue-400 text-white px-4 py-2 rounded mb-4"
      >
        + New Note
      </button>

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <a className="text-blue-600 underline" href={`/note/${note.id}`}>
              {note.id} -{" "}
              {note.content ? `${note.content.slice(0, 20)}...` : "Untitled"}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Home;
