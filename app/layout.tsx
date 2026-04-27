import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Airbnb Management",
  description: "Gestión ejecutiva de alquileres temporarios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} min-h-full bg-background text-foreground`}>
        <MobileNav />
        <Sidebar />
        <div className="flex min-h-screen w-full flex-col md:pl-64">
          <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col p-4 pt-5 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
