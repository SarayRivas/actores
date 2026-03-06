'use client';

import Link from 'next/link';
import { useMovies } from '@/context/MovieContext';

export default function MoviesPage() {
  const { movies, loading, error, deleteMovie } = useMovies();

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta película?')) {
      await deleteMovie(id);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Cargando películas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-zinc-800">Películas</h1>
        <Link
          href="/movies/create"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded transition-colors"
        >
          Crear Película
        </Link>
      </div>

      {movies.length === 0 ? (
        <p className="text-zinc-500">No hay películas disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden">
              {movie.poster && (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold text-zinc-800 mb-2">{movie.title}</h2>
                <p className="text-zinc-600 text-sm mb-1">
                  <span className="font-medium">Duración:</span> {movie.duration} min
                </p>
                <p className="text-zinc-600 text-sm mb-1">
                  <span className="font-medium">País:</span> {movie.country}
                </p>
                <p className="text-zinc-600 text-sm mb-1">
                  <span className="font-medium">Fecha:</span> {movie.releaseDate}
                </p>
                <p className="text-zinc-600 text-sm mb-1">
                  <span className="font-medium">Popularidad:</span> {movie.popularity}
                </p>
                
                {movie.prizes && movie.prizes.length > 0 && (
                  <div className="mt-2">
                    <p className="text-zinc-600 text-sm font-medium">Premios:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {movie.prizes.map((prize) => (
                        <span key={prize.id} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {prize.name} ({prize.year})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/movies/edit/${movie.id}`}
                    className="flex-1 px-3 py-2 bg-zinc-600 hover:bg-zinc-500 text-white text-center rounded transition-colors text-sm"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(movie.id)}
                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded transition-colors text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

