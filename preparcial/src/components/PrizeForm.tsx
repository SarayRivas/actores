'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMovies } from '@/context/MovieContext';
import { PrizeInput } from '../types/actor';

interface PrizeFormProps {
  esEdicion?: boolean;
  initialData?: PrizeInput;
  onSuccess?: () => void;
}

type PrizeFormErrors = Partial<Record<keyof PrizeInput, string>>;

export default function PrizeForm({ esEdicion = false, initialData, onSuccess }: PrizeFormProps) {
  const router = useRouter();
  const { addPrize } = useMovies();

  const [formData, setFormData] = useState<PrizeInput>(
    initialData || {
      name: '',
      category: '',
      year: new Date().getFullYear(),
      status: '',
    }
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<PrizeFormErrors>({});

  const validateForm = (): boolean => {
    const nuevosErrores: PrizeFormErrors = {};
  const validateForm = (): boolean => {
    const nuevosErrores: Partial<PrizeInput> = {};

    if (!formData.name?.trim()) {
      nuevosErrores.name = 'El nombre del premio es necesario';
    }
    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      nuevosErrores.year = 'El año es inválido';
    }
    if (!formData.status?.trim()) {
      nuevosErrores.status = 'La descripción es necesaria';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'year' ? Number(value) : value 
    }));
    // Clear error when user starts typing
    if (errors[name as keyof PrizeInput]) {
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
      await addPrize(formData);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/prizes');
      }
    } catch (err) {
      alert(`Error al ${esEdicion ? 'actualizar' : 'crear'} el premio`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
      <h2 className="text-2xl font-bold mb-6 text-zinc-800">
        {esEdicion ? 'Editar Premio' : 'Crear Nuevo Premio'}
      </h2>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
            Nombre del Premio *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-zinc-300'
            }`}
            placeholder="Oscar, Goya, etc."
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-zinc-700 mb-1">
            Año *
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.year ? 'border-red-500' : 'border-zinc-300'
            }`}
            placeholder="2024"
            min="1900"
            max={new Date().getFullYear() + 1}
          />
          {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-zinc-700 mb-1">
            Descripción *
          </label>
          <textarea
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.status ? 'border-red-500' : 'border-zinc-300'
            }`}
            placeholder="Descripción del premio"
          />
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : esEdicion ? 'Actualizar Premio' : 'Crear Premio'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/prizes')}
          className="px-4 py-2 bg-zinc-500 hover:bg-zinc-400 text-white font-medium rounded-md transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

