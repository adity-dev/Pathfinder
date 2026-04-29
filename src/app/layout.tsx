import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pathfinder - Discover What Matters, Near You",
  description:
    "Connect with your community, explore trending events, and find exactly what you're looking for.",
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <style>{`
          * { box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; }
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
            line-height: 1;
          }
          .shadow-level-1 { box-shadow: 0 4px 24px rgba(0, 64, 224, 0.06); }
          .shadow-level-2 { box-shadow: 0 12px 32px rgba(0, 64, 224, 0.12); }
          .shadow-level-3 { box-shadow: 0 20px 48px rgba(0, 64, 224, 0.18); }
        `}</style>
      </head>
      <body className="bg-[#f7fafd] text-[#181c1e] antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
