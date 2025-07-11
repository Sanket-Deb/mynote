"use client";

import { useEffect } from "react";

const RegisterSW = () => {
  useEffect(() => {
    console.log("📦 RegisterSW mounted"); // Add this
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log("SW registered ✅: ", registration);
          },
          (error) => {
            console.error("SW registration failed ❌: ", error);
          }
        );
      });
    }
  }, []);

  return null;
};

export default RegisterSW;
