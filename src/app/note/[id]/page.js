"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const NotePage = () => {
  const { id } = useParams(); // Get note ID from URL
  const [text, setText] = useState(""); // State for textarea
  const router = useRouter();

  // On mount, check if note exists. If not, create it.
  useEffect(() => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    let found = notes.find((n) => n.id === id);

    if (!found) {
      // If note with this ID doesn't exist, create one immediately
      found = {
        id,
        content: "",
        lastModified: new Date().toISOString(),
      };
      notes.unshift(found);
      localStorage.setItem("notes", JSON.stringify(notes));
    }

    setText(found.content); // Fill textarea
  }, [id]);

  // Update note as user types
  const handleChange = (e) => {
    const newContent = e.target.value;
    setText(newContent);

    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const updated = notes.map((n) =>
      n.id === id
        ? {
            ...n,
            content: newContent,
            lastModified: new Date().toISOString(),
          }
        : n
    );

    localStorage.setItem("notes", JSON.stringify(updated));
  };

  return (
    <main className="p-4">
      <div className="mb-4">
        <button
          onClick={() => router.push("/")}
          className="underline text-sm text-blue-600"
        >
          ← Back to all notes
        </button>
      </div>

      <textarea
        className="w-full h-[80vh] p-4 border rounded text-sm"
        value={text}
        onChange={handleChange}
        placeholder="Start typing your note..."
      />
    </main>
  );
};

export default NotePage;
