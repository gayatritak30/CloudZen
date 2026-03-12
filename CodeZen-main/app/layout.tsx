import type React from "react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { UserProvider } from "@/context/user-context";
import "./globals.css";
import Provider from "@/components/provider";
import { AIAssistant } from "@/components/ai-assistant";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CodeZen - Learn. Code. Compile. Certify.",
  metadataBase: new URL("https://code-zen-silk.vercel.app"),
  description:
    "The all-in-one platform to master 10+ programming languages with interactive courses, integrated compilers, AI mentoring, and verified certificates.",
  generator: "v0.app",
  keywords: [
    "coding platform",
    "learn programming",
    "online compiler",
    "coding courses",
    "programming certificates",
    "AI coding mentor",
    "Python courses",
    "JavaScript courses",
    "coding tutorials",
  ],
  authors: [{ name: "CodeZen Team" }],
  creator: "CodeZen",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "CodeZen - Learn. Code. Compile. Certify.",
    description:
      "Master programming with interactive courses, AI mentoring, and verified certificates.",
    siteName: "CodeZen",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "CodeZen - Learn. Code. Compile. Certify.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeZen - Learn. Code. Compile. Certify.",
    description:
      "Master programming with interactive courses, AI mentoring, and verified certificates.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <UserProvider>
          <Provider>{children}</Provider>
        </UserProvider>
        <AIAssistant/>
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  );
}
