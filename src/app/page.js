"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { createAnonNote } from "@/lib/firestoreHelpers";

const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    signOut(auth).catch((err) => console.error("Auto-logout failed:", err));
  }, []);

  const handleAnonymous = async () => {
    const id = nanoid(12);
    await createAnonNote(id);
    router.push(`/note/${id}`);
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/home");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to myNote</h1>
      <p className="mb-8 text-gray-600">Select a path:</p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={handleAnonymous}
          className="bg-blue-200 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Continue without login
        </button>

        <button
          onClick={handleLogin}
          className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          Continue with login
        </button>
      </div>
    </main>
  );
};

export default LandingPage;
