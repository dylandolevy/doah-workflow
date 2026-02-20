// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DoAH Chatbot",
  description: "AI-powered Chatbot for DoAH — demo built with OpenAI ChatKit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-green-50 to-white`}
      >
        {/* ChatKit script — loads after hydration */}
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="afterInteractive"
        />

        {/* App container: centers pages by default; individual pages can override */}
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
          {children}
        </div>
      </body>
    </html>
  );
}