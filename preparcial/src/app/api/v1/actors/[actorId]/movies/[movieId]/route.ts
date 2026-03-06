import { NextRequest, NextResponse } from 'next/server';
import { Actor, Movie } from '@/types/actor';


const actors: Actor[] = [];
const movies: Movie[] = [];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ actorId: string; movieId: string }> }
) {
  const { actorId, movieId } = await params;
  

  let actor = actors.find(a => a.id === actorId);
  if (!actor) {
    
    actor = { id: actorId, name: '', photo: '', nationality: '', birthDate: '', biography: '', movies: [] };
  }
  
 
  const movie = movies.find(m => m.id === movieId);
  if (!movie) {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
  }
  

  if (!actor.movies) {
    actor.movies = [];
  }
  
  const movieExists = actor.movies.some(m => m.id === movieId);
  if (!movieExists) {
    actor.movies.push(movie);
  }
  
 
  if (!movie.actors) {
    movie.actors = [];
  }
  
  const actorExists = movie.actors.some(a => a.id === actorId);
  if (!actorExists) {
    movie.actors.push({
      id: actor.id,
      name: actor.name,
      photo: actor.photo,
      nationality: actor.nationality,
      birthDate: actor.birthDate,
      biography: actor.biography
    });
  }
  
  return NextResponse.json({ 
    message: 'Movie assigned to actor successfully',
    actor,
    movie
  }, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ actorId: string; movieId: string }> }
) {
  const { actorId, movieId } = await params;
  
  const actor = actors.find(a => a.id === actorId);
  if (!actor || !actor.movies) {
    return NextResponse.json({ error: 'Actor not found or no movies assigned' }, { status: 404 });
  }
  
  const movie = movies.find(m => m.id === movieId);
  if (movie && movie.actors) {
    movie.actors = movie.actors.filter(a => a.id !== actorId);
  }
  
  actor.movies = actor.movies.filter(m => m.id !== movieId);
  
  return NextResponse.json({ 
    message: 'Movie removed from actor successfully',
    actor
  });
}

