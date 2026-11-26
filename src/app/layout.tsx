import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AgentFlow — Build, Deploy & Scale Autonomous AI Agents",
    template: "%s | AgentFlow",
  },
  description:
    "The platform for building, deploying, and scaling autonomous AI agents. From prototype to production in minutes. Multi-agent orchestration, persistent memory, enterprise security.",
  keywords: [
    "AI agents",
    "autonomous agents",
    "agent orchestration",
    "AI platform",
    "machine learning",
    "LLM agents",
    "agent framework",
    "AI deployment",
  ],
  authors: [{ name: "AgentFlow" }],
  creator: "AgentFlow",
  publisher: "AgentFlow",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://agentflow.ai",
    siteName: "AgentFlow",
    title: "AgentFlow — Build, Deploy & Scale Autonomous AI Agents",
    description:
      "The platform for building, deploying, and scaling autonomous AI agents. From prototype to production in minutes.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AgentFlow - AI Agent Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentFlow — Build, Deploy & Scale Autonomous AI Agents",
    description:
      "The platform for building, deploying, and scaling autonomous AI agents. From prototype to production in minutes.",
    images: ["/og-image.png"],
    creator: "@agentflow",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[var(--bg)]">
        <ThemeProvider>
          <Navigation />
          <main className="flex-1 pt-16 lg:pt-20">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}