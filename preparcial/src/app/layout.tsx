import type { Metadata } from "next";
import "./globals.css";
import { ActorsProvider } from "@/context/ActorContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Actores",
  description: "Aplicación para gestionar actores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <ActorsProvider>
          <Navbar />
          {children}
        </ActorsProvider>
      </body>
    </html>
  );
}

