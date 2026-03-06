'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMovies } from '@/context/MovieContext';
import { MovieInput } from '../types/actor';

interface MovieFormProps {
  esEdicion?: boolean;
}

export default function MovieForm({ esEdicion = false }: MovieFormProps) {
  const router = useRouter();
  const params = useParams();
  const { addMovie, updateMovie, getMovieById, movies } = useMovies();

  const [formData, setFormData] = useState<MovieInput>({
    title: '',
    poster: '',
    duration: 0,
    country: '',
    releaseDate: '',
    popularity: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<MovieInput>>({});

  useEffect(() => {
    if (esEdicion && params.id) {
      const movie = getMovieById(params.id as string);
      if (movie) {
        setFormData({
          title: movie.title,
          poster: movie.poster,
          duration: movie.duration,
          country: movie.country,
          releaseDate: movie.releaseDate,
          popularity: movie.popularity,
        });
      } else {
        const movieFound = movies.find((m) => m.id === params.id);
        if (movieFound) {
          setFormData({
            title: movieFound.title,
            poster: movieFound.poster,
            duration: movieFound.duration,
            country: movieFound.country,
            releaseDate: movieFound.releaseDate,
            popularity: movieFound.popularity,
          });
        }
      }
    }
  }, [esEdicion, params.id, getMovieById, movies]);

  const validateForm = (): boolean => {
    const nuevosErrores: Partial<MovieInput> = {};

    if (!formData.title?.trim()) {
      nuevosErrores.title = 'El título es necesario';
    }
    if (!formData.poster?.trim()) {
      nuevosErrores.poster = 'El póster es necesario';
    }
    if (!formData.duration || formData.duration <= 0) {
      nuevosErrores.duration = 'La duración es necesaria';
    }
    if (!formData.country?.trim()) {
      nuevosErrores.country = 'El país es necesario';
    }
    if (!formData.releaseDate) {
      nuevosErrores.releaseDate = 'La fecha de lanzamiento es necesaria';
    }
    if (!formData.popularity || formData.popularity < 0) {
      nuevosErrores.popularity = 'La popularidad es necesaria';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'duration' || name === 'popularity' ? Number(value) : value 
    }));
    // Clear error when user starts typing
    if (errors[name as keyof MovieInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (esEdicion && params.id) {
        await updateMovie(params.id as string, formData);
        router.push('/movies');
      } else {
        await addMovie(formData);
        router.push('/movies');
      }
    } catch (err) {
      alert(`Error al ${esEdicion ? 'actualizar' : 'crear'} la película`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
      <h2 className="text-2xl font-bold mb-6 text-zinc-800">
        {esEdicion ? 'Editar Película' : 'Crear Nueva Película'}
      </h2>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-zinc-300'
            }`}
            placeholder="Ingresa el título de la película"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Poster */}
        <div>
          <label htmlFor="poster" className="block text-sm font-medium text-zinc-700 mb-1">
            URL del Póster *
          </label>
          <input
            type="url"
            id="poster"
            name="poster"
            value={formData.poster}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.poster ? 'border-red-500' : 'border-zinc-300'
            }`}
            placeholder="https://ejemplo.com/poster.jpg"
          />
          {errors.poster && <p className="text-red-500 text-sm mt-1">{errors.poster}</p>}
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-zinc-700 mb-1">
            Duración (minutos) *
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.duration ? 'border-red-500' : 'border-zinc-300'
            }`}
            placeholder="120"
            min="1"
          />
          {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-zinc-700 mb-1">
            País *
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.country ? 'border-red-500' : 'border-zinc-300'
            }`}
            placeholder="Ingresa el país"
          />
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>

        {/* ReleaseDate */}
        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium text-zinc-700 mb-1">
            Fecha de Lanzamiento *
          </label>
          <input
            type="date"
            id="releaseDate"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.releaseDate ? 'border-red-500' : 'border-zinc-300'
            }`}
          />
          {errors.releaseDate && <p className="text-red-500 text-sm mt-1">{errors.releaseDate}</p>}
        </div>

        {/* Popularity */}
        <div>
          <label htmlFor="popularity" className="block text-sm font-medium text-zinc-700 mb-1">
            Popularidad *
          </label>
          <input
            type="number"
            id="popularity"
            name="popularity"
            value={formData.popularity}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.popularity ? 'border-red-500' : 'border-zinc-300'
            }`}
            placeholder="0-100"
            min="0"
          />
          {errors.popularity && <p className="text-red-500 text-sm mt-1">{errors.popularity}</p>}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : esEdicion ? 'Actualizar Película' : 'Crear Película'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/movies')}
          className="px-4 py-2 bg-zinc-500 hover:bg-zinc-400 text-white font-medium rounded-md transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

