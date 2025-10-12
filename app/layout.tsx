import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tejas Savaliya's Portfolio | Full Stack Developer",
  description: "🖥️ Full Stack Developer exploring and building AI-powered projects 🤖",
  openGraph: {
    title: "Tejas Savaliya's Portfolio | Full Stack Developer",
    description: "🖥️ Full Stack Developer exploring and building AI-powered projects 🤖",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "Tejas Savaliya",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/me.jpeg`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: "Tejas Savaliya's Portfolio",
    description: "🖥️ Full Stack Developer exploring and building AI-powered projects 🤖",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/me.jpeg`],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
             <Navigation />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
