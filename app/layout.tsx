import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import ReactQueryClientProvider from "@/components/react-query-client-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TIMPLA - Tailored Intelligent Meal Planning Lifestyle Assistant",
  description: "TIMPLA - Your AI-powered meal planning assistant. Get personalized meal plans tailored to your dietary preferences and health goals.",
  keywords: ["meal planning", "AI", "nutrition", "diet", "health", "recipes", "meal prep"],
  authors: [{ name: "TIMPLA Team" }],
  icons: {
    icon: [
      { url: "/logo-tab.png?v=3", sizes: "16x16", type: "image/png" },
      { url: "/logo-tab.png?v=3", sizes: "32x32", type: "image/png" },
      { url: "/logo-tab.png?v=3", sizes: "48x48", type: "image/png" },
      { url: "/logo-tab.png?v=3", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/logo-tab.png?v=3",
    apple: "/logo-tab.png?v=3",
  },
  openGraph: {
    title: "TIMPLA - Tailored Intelligent Meal Planning Lifestyle Assistant",
    description: "Your AI-powered meal planning assistant. Get personalized meal plans tailored to your dietary preferences and health goals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo-tab.png?v=4" sizes="any" type="image/png" />
          <link rel="icon" href="/logo-tab.png?v=4" sizes="16x16" type="image/png" />
          <link rel="icon" href="/logo-tab.png?v=4" sizes="32x32" type="image/png" />
          <link rel="icon" href="/logo-tab.png?v=4" sizes="48x48" type="image/png" />
          <link rel="shortcut icon" href="/logo-tab.png?v=4" type="image/png" />
          <link rel="apple-touch-icon" href="/logo-tab.png?v=4" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var savedTheme = localStorage.getItem('theme');
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  } catch (e) {}
                })();
              `,
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}
        >
          <ReactQueryClientProvider>
            <Navbar />
            <div className="pt-16 min-h-screen w-full">
              {children}
            </div>
          </ReactQueryClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
