import type { Metadata } from "next";
import { Luckiest_Guy, Poppins, Titan_One, Fredoka } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NotificationManager from "@/components/layout/NotificationManager";
import BackgroundWall from "@/components/ui/BackgroundWall";

const luckiest = Luckiest_Guy({
  variable: "--font-luckiest",
  subsets: ["latin"],
  weight: ["400"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const titan = Titan_One({
  variable: "--font-titan",
  subsets: ["latin"],
  weight: ["400"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Nigeria Story",
  description: "Breaking Boundaries, Uniting a Nation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${luckiest.variable} ${poppins.variable} ${titan.variable} ${fredoka.variable} font-body antialiased bg-black text-white min-h-screen flex flex-col relative`}
      >
        <NotificationManager />
        <Navbar />
        <main className="flex-grow relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
