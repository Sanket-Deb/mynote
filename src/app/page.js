"use client";
import { useEffect, useState } from "react";

const Home = () => {
  const [note, setNote] = useState("");

  // Load saved note
  useEffect(() => {
    const saved = localStorage.getItem("note");
    if (saved) setNote(saved);
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem("note", note);
  }, [note]);

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <textarea
        className="w-full h-[90vh] max-w-3xl p-4 text-lg text-gray-800 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Start typing your note here..."
      />
    </main>
  );
};

export default Home;
