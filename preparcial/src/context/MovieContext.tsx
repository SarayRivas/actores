'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie, MovieInput, Prize, PrizeInput } from '../types/actor';

interface MovieContextType {
  movies: Movie[];
  prizes: Prize[];
  loading: boolean;
  error: string | null;
  getMovies: () => Promise<void>;
  addMovie: (movie: MovieInput) => Promise<void>;
  updateMovie: (id: string, movie: MovieInput) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  getMovieById: (id: string) => Movie | undefined;
  getPrizes: () => Promise<void>;
  addPrize: (prize: PrizeInput) => Promise<void>;
  deletePrize: (id: string) => Promise<void>;
  getPrizeById: (id: string) => Prize | undefined;
  assignMovieToActor: (actorId: string, movieId: string) => Promise<void>;
  assignPrizeToMovie: (movieId: string, prizeId: string) => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

const MOVIES_API_URL = '/api/v1/movies';

export function MovieProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(MOVIES_API_URL);
      if (!response.ok) {
        throw new Error('Error al obtener películas');
      }
      const data = await response.json();
      setMovies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  const addMovie = async (movie: MovieInput) => {
    try {
      const response = await fetch(MOVIES_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie),
      });
      if (!response.ok) {
        throw new Error('Error al crear película');
      }
      const newMovie = await response.json();
      setMovies((prev) => [...prev, newMovie]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
      throw err;
    }
  };

  const updateMovie = async (id: string, movie: MovieInput) => {
    try {
      const response = await fetch(`${MOVIES_API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...movie }),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar película');
      }
      const updatedMovie = await response.json();
      setMovies((prev) =>
        prev.map((m) => (m.id === id ? updatedMovie : m))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
      throw err;
    }
  };

  const deleteMovie = async (id: string) => {
    try {
      const response = await fetch(`${MOVIES_API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar película');
      }
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
      throw err;
    }
  };

  const getMovieById = (id: string) => {
    return movies.find((m) => m.id === id);
  };

  

  const assignMovieToActor = async (actorId: string, movieId: string) => {
    try {
      const response = await fetch(`/api/v1/actors/${actorId}/movies/${movieId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Error al asignar película al actor');
      }
      // Refresh movies to get updated data
      await getMovies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
      throw err;
    }
  };

  const assignPrizeToMovie = async (movieId: string, prizeId: string) => {
    try {
      const response = await fetch(`/api/v1/movies/${movieId}/prizes/${prizeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Error al asignar premio a la película');
      }
      // Refresh movies to get updated data
      await getMovies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
      throw err;
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <MovieContext.Provider
      value={{
        movies,
        loading,
        error,
        getMovies,
        addMovie,
        updateMovie,
        deleteMovie,
        getMovieById,
        assignMovieToActor,
        assignPrizeToMovie,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovies debe ser usado dentro de un MovieProvider');
  }
  return context;
}

