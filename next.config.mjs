import nextPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  buildExcludes: [/app-build-manifest\.json$/], // <-- exclude it here
})(nextConfig);

export default withPWA;
