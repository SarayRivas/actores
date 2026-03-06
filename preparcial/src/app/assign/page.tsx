'use client';

import { useState, useEffect } from 'react';
import { useActores } from '@/context/ActorContext';
import { useMovies } from '@/context/MovieContext';

export default function AssignPage() {
  const { actors, getActor } = useActores();
  const { movies, prizes, getMovies, getPrizes, assignMovieToActor, assignPrizeToMovie } = useMovies();
  
  const [selectedActor, setSelectedActor] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedPrizeMovie, setSelectedPrizeMovie] = useState('');
  const [selectedPrize, setSelectedPrize] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getActor();
    getMovies();
    getPrizes();
  }, [getActor, getMovies, getPrizes]);

  const handleAssignMovieToActor = async () => {
    if (!selectedActor || !selectedMovie) {
      setMessage('Por favor selecciona un actor y una película');
      return;
    }

    setLoading(true);
    try {
      await assignMovieToActor(selectedActor, selectedMovie);
      setMessage('Película asignada al actor correctamente');
      setSelectedActor('');
      setSelectedMovie('');
    } catch (err) {
      setMessage('Error al asignar la película');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPrizeToMovie = async () => {
    if (!selectedPrizeMovie || !selectedPrize) {
      setMessage('Por favor selecciona una película y un premio');
      return;
    }

    setLoading(true);
    try {
      await assignPrizeToMovie(selectedPrizeMovie, selectedPrize);
      setMessage('Premio asignado a la película correctamente');
      setSelectedPrizeMovie('');
      setSelectedPrize('');
    } catch (err) {
      setMessage('Error al asignar el premio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-800 mb-8">Asignaciones</h1>

      {message && (
        <div className={`mb-6 p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Assign Movie to Actor */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <h2 className="text-xl font-bold text-zinc-800 mb-4">Asignar Película a Actor</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Actor</label>
              <select
                value={selectedActor}
                onChange={(e) => setSelectedActor(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un actor</option>
                {actors.map((actor) => (
                  <option key={actor.id} value={actor.id}>
                    {actor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Película</label>
              <select
                value={selectedMovie}
                onChange={(e) => setSelectedMovie(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una película</option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAssignMovieToActor}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Asignando...' : 'Asignar Película'}
            </button>
          </div>
        </div>

        {/* Assign Prize to Movie */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <h2 className="text-xl font-bold text-zinc-800 mb-4">Asignar Premio a Película</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Película</label>
              <select
                value={selectedPrizeMovie}
                onChange={(e) => setSelectedPrizeMovie(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una película</option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Premio</label>
              <select
                value={selectedPrize}
                onChange={(e) => setSelectedPrize(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un premio</option>
                {prizes.map((prize) => (
                  <option key={prize.id} value={prize.id}>
                    {prize.name} ({prize.year})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAssignPrizeToMovie}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Asignando...' : 'Asignar Premio'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

