import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RegisterSW from "./register-sw"; // client component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "myNote - Minimal Notepad PWA",
  description: "A privacy-first online notepad",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-1.svg",
    apple: "/icon-1.svg",
  },
};

export const viewport = {
  themeColor: "#3b82f6", // ✅ moved here
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <RegisterSW /> {/* Move here */}
      </body>
    </html>
  );
}
