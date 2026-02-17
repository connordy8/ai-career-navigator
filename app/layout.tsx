import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import { UserProfileProvider } from "@/lib/context/UserProfileContext";

export const metadata: Metadata = {
  title: "Career Navigator | Merit America",
  description: "Find a better job or build skills for a great career. Free career guidance for working adults.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#001846",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <UserProfileProvider>
          <Header />
          <main className="min-h-screen pb-safe">
            {children}
          </main>
          <FloatingChatButton />
          <BottomNav />
        </UserProfileProvider>
      </body>
    </html>
  );
}
