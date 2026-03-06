'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Actor, ActorInput } from '../types/actor';

interface ActorTypeContext {
  actors: Actor[];
  loading: boolean;
  error: string | null;
  getActor: () => Promise<void>;
  addActor: (actor: ActorInput) => Promise<void>;
  updateActor: (id: string, actor: ActorInput) => Promise<void>;
  deleteActor: (id: string) => Promise<void>;
  getActorById: (id: string) => Actor | undefined;
}

const ActorContext = createContext<ActorTypeContext | undefined>(undefined);

const API_URL = '/api/v1/actors';

export function ActorsProvider({ children }: { children: ReactNode }) {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getActor = async () => {
    try {
      setLoading(true);
      setError(null);
      const respuesta = await fetch(API_URL);
      if (!respuesta.ok) {
        throw new Error('Error al obtener actores');
      }
      const datos = await respuesta.json();
      setActors(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  const addActor = async (actor: ActorInput) => {
    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actor),
      });
      if (!respuesta.ok) {
        throw new Error('Error al crear actor');
      }
      const nuevoActor = await respuesta.json();
      setActors((prev) => [...prev, nuevoActor]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
      throw err;
    }
  };

  const updateActor = async (id: string, actor: ActorInput) => {
    try {
      const respuesta = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...actor }),
      });
      if (!respuesta.ok) {
        throw new Error('Error al actualizar actor');
      }
      const actorActualizado = await respuesta.json();
      setActors((prev) =>
        prev.map((a) => (a.id === id ? actorActualizado : a))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
      throw err;
    }
  };

  const deleteActor = async (id: string) => {
    try {
      const respuesta = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) {
        throw new Error('Error al eliminar actor');
      }
      setActors((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
      throw err;
    }
  };

  const getActorById = (id: string) => {
    return actors.find((a) => a.id === id);
  };

  useEffect(() => {
    getActor();
  }, []);

  return (
    <ActorContext.Provider
      value={{
        actors,
        loading,
        error,
        getActor,
        addActor,
        updateActor,
        deleteActor,
        getActorById,
      }}
    >
      {children}
    </ActorContext.Provider>
  );
}

export function useActores() {
  const contexto = useContext(ActorContext);
  if (contexto === undefined) {
    throw new Error('useActores debe ser usado dentro de un ProveedorActores');
  }
  return contexto;
}

