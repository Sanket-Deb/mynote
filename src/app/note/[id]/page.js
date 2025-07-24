"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const NotePage = () => {
  const { id } = useParams(); // Get note ID from URL
  const router = useRouter();

  const [text, setText] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [password, setPassword] = useState("");

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  useEffect(() => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    let found = notes.find((n) => n.id === id);
    if (!found) {
      found = {
        id,
        content: "",
        lastModified: new Date().toISOString(),
      };
      notes.unshift(found);
      localStorage.setItem("notes", JSON.stringify(notes));
    }

    setText(found.content);
    setPassword(found.password || "");
  }, [id]);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const updated = notes.map((n) =>
      n.id === id
        ? {
            ...n,
            content: newText,
            lastModified: new Date().toISOString(),
            password,
          }
        : n
    );
    localStorage.setItem("notes", JSON.stringify(updated));
  };

  const handleSetCustomUrl = () => {
    if (!customUrl.trim()) return;

    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const note = notes.find((n) => n.id === id);

    if (!note) return;

    const updatedNote = { ...note, id: customUrl.trim() };
    const updatedNotes = [updatedNote, ...notes.filter((n) => n.id !== id)];

    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    router.push(`/note/${customUrl.trim()}`);
  };

  const handleSetPassword = () => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const updated = notes.map((n) => (n.id === id ? { ...n, password } : n));
    localStorage.setItem("notes", JSON.stringify(updated));
    alert("Password Set");
    setShowPasswordInput(false);
    setPassword("");
  };

  return (
    <main className="bg-white min-h-screen p-4 text-black">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => alert("Google login coming soon!")}
          className="bg-blue-400 text-white px-3 py-1 rounded"
        >
          Login with Google
        </button>
        <div className="space-x-2">
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-blue-400 underline text-sm"
          >
            {" "}
            Set Custom URL{" "}
          </button>
          <button
            onClick={() => setShowPasswordInput(!showPasswordInput)}
            className="text-blue-400 underline text-sm"
          >
            {" "}
            Set Password{" "}
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
            onClick={() => setShowUrlInput(!showUrlInput)}
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
            placeholder="Enter URL of your choice"
          />
          <button
            onClick={handleSetPassword}
            className="bg-green-400 text-white px-4 py-1 rounded"
          >
            Set Password
          </button>
          <button
            onClick={() => setShowPasswordInput(!showPasswordInput)}
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
