'use client';

import { useActores } from '@/context/ActorContext';
import Link from 'next/link';
export default function ListaActores() {
  const { actors, loading, error, deleteActor } = useActores();

  const manageDelete = async (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${nombre}?`)) {
      try {
        await deleteActor(id);
      } catch (err) {
        alert('Error al eliminar el actor');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-zinc-600">Cargando actores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (actors.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="text-xl text-zinc-600">No hay actores en la lista</div>
        <Link
          href="/create"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
        >
          Crear Primer Actor
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {actors.map((actor) => (
        <div
          key={actor.id}
          className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="aspect-video relative bg-zinc-100">
            {actor.photo ? (
              <img
                src={actor.photo}
                alt={actor.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                Sin foto
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-zinc-800 mb-2">
              {actor.name}
            </h3>
            <div className="text-sm text-zinc-600 mb-1">
              <span className="font-medium">Nacionalidad:</span> {actor.nationality}
            </div>
            <div className="text-sm text-zinc-600 mb-3">
              <span className="font-medium">Cumpleaños:</span> {actor.birthDate}
            </div>
            <p className="text-sm text-zinc-500 mb-4 line-clamp-3">
              {actor.biography}
            </p>
            <div className="flex gap-2">
              <Link
                href={`/edit/${actor.id}`}
                className="flex-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-400 text-white text-center rounded transition-colors text-sm"
              >
                 Editar
              </Link>
              <button
                onClick={() => manageDelete(actor.id, actor.name)}
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded transition-colors text-sm"
              >
                 Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

