'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMovies } from '@/context/MovieContext';
import PrizeForm from '@/components/PrizeForm';

export default function PrizesPage() {
  const { prizes, loading, error, getPrizes, deletePrize } = useMovies();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getPrizes();
  }, [getPrizes]);

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este premio?')) {
      await deletePrize(id);
    }
  };

  const handlePrizeCreated = () => {
    setShowForm(false);
    getPrizes();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Cargando premios...</p>
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
        <h1 className="text-3xl font-bold text-zinc-800">Premios</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded transition-colors"
        >
          {showForm ? 'Cancelar' : 'Crear Premio'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <PrizeForm onSuccess={handlePrizeCreated} />
        </div>
      )}

      {prizes.length === 0 ? (
        <p className="text-zinc-500">No hay premios disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prizes.map((prize) => (
            <div key={prize.id} className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-zinc-800 mb-1">{prize.name}</h2>
                  <p className="text-zinc-600 text-sm mb-2">Año: {prize.year}</p>
                  <p className="text-zinc-600 text-sm">{prize.description}</p>
                </div>
                <button
                  onClick={() => handleDelete(prize.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded transition-colors text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

