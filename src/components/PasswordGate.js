"use client";

import { useState } from "react";

const PasswordGate = ({ correctPassword, onUnlock }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = () => {
    if (input === correctPassword) {
      onUnlock();
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <p className="mb-4 text-gray-700">This note is password protected </p>
      <div className="relative mb-2">
        <input
          type={show ? "text" : "password"}
          className="border p-2 w-full mb-2"
          placeholder="Enter password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <span
          className="abslute right-3 top-2.5 cursor-pointer text-sm text-gray-500 select-none"
          onClick={() => setShow((s) => !s)}
        >
          {show ? "🔒" : "🔒"}
        </span>
      </div>

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
