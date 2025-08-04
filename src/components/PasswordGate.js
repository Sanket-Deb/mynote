"use client";

import { useState } from "react";

const PasswordGate = ({ savedPassword, onSuccess }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (input === savedPassword) {
      onSuccess();
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <p className="mb-4 text-gray-700">This note is password protected </p>
      <input
        type="password"
        className="border p-2 w-full mb-2"
        placeholder="Enter password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="bg-blue-400 text-white px-4 py-1 rounded"
        onClick={handleSubmit}
      >
        {" "}
        Submit
      </button>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default PasswordGate;
