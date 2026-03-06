'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useActores } from '@/context/ActorContext';
import { ActorInput } from '../types/actor';


interface ActorFormProps {
  esEdicion?: boolean;
}

export default function ActorForm({ esEdicion = false }: ActorFormProps) {
  const router = useRouter();
  const params = useParams();
  const { addActor, updateActor, getActorById, actors } = useActores();

  const [formData, setFormData] = useState<ActorInput>({
    name: '',
    photo: '',
    nationality: '',
    birthDate: '',
    biography: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ActorInput>>({});

  useEffect(() => {
    if (esEdicion && params.id) {
      const actor = getActorById(params.id as string);
      if (actor) {
        setFormData({
          name: actor.name,
          photo: actor.photo,
          nationality: actor.nationality,
          birthDate: actor.birthDate,
          biography: actor.biography,
        });
      } else {
        
        const actorFound = actors.find(a => a.id === params.id);
        if (actorFound) {
          setFormData({
            name: actorFound.name,
            photo: actorFound.photo,
            nationality: actorFound.nationality,
            birthDate: actorFound.birthDate,
            biography: actorFound.biography,
          });
        }
      }
    }
  }, [esEdicion, params.id, getActorById, actors]);

  const validateForm = (): boolean => {
    const nuevosErrores: Partial<ActorInput> = {};

    if (!formData.name.trim()) {
      nuevosErrores.name = 'El nombre es necesario';
    }
    if (!formData.nationality.trim()) {
      nuevosErrores.nationality = 'La nacionalidad es necesaria';
    }
    if (!formData.birthDate) {
      nuevosErrores.birthDate = 'La fecha de nacimiento es necesaria';
    }
    if (!formData.biography.trim()) {
      nuevosErrores.biography = 'La biografía es necesaria';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ActorInput]) {
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
        await updateActor(params.id as string, formData);
        router.push('/actors');
      } else {
        await addActor(formData);
        router.push('/actors');
      }
    } catch (err) {
      alert(`Error al ${esEdicion ? 'actualizar' : 'crear'} el actor`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
      <h2 className="text-2xl font-bold mb-6 text-zinc-800">
        {esEdicion ? 'Editar Actor' : 'Crear Nuevo Actor'}
      </h2>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
            Nombre *
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
            placeholder="Ingresa el nombre del actor"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Photo */}
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-zinc-700 mb-1">
            URL de la Foto
          </label>
          <input
            type="url"
            id="photo"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://ejemplo.com/foto.jpg"
          />
        </div>

        {/* Nationality */}
        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-zinc-700 mb-1">
            Nacionalidad *
          </label>
          <input
            type="text"
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.nationality ? 'border-red-500' : 'border-zinc-300'
            }`}
            placeholder="Ingresa la nacionalidad"
          />
          {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
        </div>

        {/* BirthDate */}
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-zinc-700 mb-1">
            Fecha de Nacimiento *
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.birthDate ? 'border-red-500' : 'border-zinc-300'
            }`}
          />
          {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
        </div>

        {/* Biography */}
        <div>
          <label htmlFor="biography" className="block text-sm font-medium text-zinc-700 mb-1">
            Biografía *
          </label>
          <textarea
            id="biography"
            name="biography"
            value={formData.biography}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.biography ? 'border-red-500' : 'border-zinc-300'
            }`}
            placeholder="Escribe la biografía del actor"
          />
          {errors.biography && <p className="text-red-500 text-sm mt-1">{errors.biography}</p>}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : esEdicion ? 'Actualizar Actor' : 'Crear Actor'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/actors')}
          className="px-4 py-2 bg-zinc-500 hover:bg-zinc-400 text-white font-medium rounded-md transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

