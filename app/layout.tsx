import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import LenisProvider from "@/components/provider/LenisProvider";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ChatProvider } from "@/context/ChatContext";
import { ChatWidgetWithContext } from "@/components/chat/ChatWidgetWithContext";
import NavDropdownMenu from "@/components/layout/navDropdownMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "know iT",
  description: "know your career and best path for you",
  manifest: "/manifest.webmanifest",
  icons: [{
    rel: 'icon',
    type: 'image/ico',
    sizes: '32x32',
    url: '/favicon1/favicon.ico',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '96x96',
    url: '/favicon1/favicon-96x96.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '192x192',
    url: '/favicon1/android-chrome-192x192.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '512x512',
    url: '/favicon1/android-chrome-512x512.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    url: '/favicon1/apple-touch-icon.png',
  },]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LenisProvider>
          {children}
        </LenisProvider>
        <ChatWidget
          data-lenis-prevent
          title="Chat Support"
          subtitle="We typically reply within minutes"
          accentColor="#00bbff"
        />
        <NavDropdownMenu/>
      </body>
    </html>
  );
}
