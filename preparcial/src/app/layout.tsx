import type { Metadata } from "next";
import "./globals.css";
import { ActorsProvider } from "@/context/ActorContext";
import { MovieProvider } from "@/context/MovieContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Actores y Películas",
  description: "Aplicación para gestionar actores y películas",
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
          <MovieProvider>
            <Navbar />
            {children}
          </MovieProvider>
        </ActorsProvider>
      </body>
    </html>
  );
}

