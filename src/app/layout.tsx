import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/lib/auth-client";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LingoHub - Learn Languages Through Stories",
  description: "Interactive language learning through immersive, story-driven lessons",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fafafa] dark:bg-[#0a0a0a] text-[#1a1a1a] dark:text-[#fafafa] transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <UserProfileProvider>
              <Navbar />
              {children}
              <Footer />
            </UserProfileProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
