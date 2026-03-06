'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-zinc-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/actors" className="text-xl font-bold hover:text-zinc-300">
          CineApp
        </Link>
        <div className="flex gap-4">
          <Link
            href="/actors"
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded transition-colors"
          >
            Actores
          </Link>
          <Link
            href="/movies"
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded transition-colors"
          >
            Películas
          </Link>
          <Link
            href="/prizes"
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded transition-colors"
          >
            Premios
          </Link>
          <Link
            href="/create"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors"
          >
            Crear Actor
          </Link>
        </div>
      </div>
    </nav>
  );
}

