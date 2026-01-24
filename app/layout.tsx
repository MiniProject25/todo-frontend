import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ToastProvider from "./providers/ToastProvider";

const inter = Inter({
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Taskflow",
  description: "The worst todo list of all time!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen flex flex-col`}
      >
        <ToastProvider />
        <main className="grow">
          {children}
        </main>
      </body>
    </html>
  );
}
