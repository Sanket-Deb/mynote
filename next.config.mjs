// next.config.mjs
import nextPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Any other standard Next.js config options
};

const configWithPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  // disable: false, // optionally enable in dev
})(nextConfig); // ⬅️ correct usage with ESM

export default configWithPWA;
