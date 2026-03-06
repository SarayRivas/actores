import { NextRequest, NextResponse } from 'next/server';
import { Movie, Prize } from '@/types/actor';


const movies: Movie[] = [];
const prizes: Prize[] = [];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ movieId: string; prizeId: string }> }
) {
  const { movieId, prizeId } = await params;
  
  
  const movie = movies.find(m => m.id === movieId);
  if (!movie) {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
  }
  

  const prize = prizes.find(p => p.id === prizeId);
  if (!prize) {
    return NextResponse.json({ error: 'Prize not found' }, { status: 404 });
  }
  
 
  if (!movie.prizes) {
    movie.prizes = [];
  }
  
  const prizeExists = movie.prizes.some(p => p.id === prizeId);
  if (!prizeExists) {
    movie.prizes.push(prize);
  }
  
  return NextResponse.json({ 
    message: 'Prize assigned to movie successfully',
    movie
  }, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ movieId: string; prizeId: string }> }
) {
  const { movieId, prizeId } = await params;
  
  const movie = movies.find(m => m.id === movieId);
  if (!movie || !movie.prizes) {
    return NextResponse.json({ error: 'Movie not found or no prizes assigned' }, { status: 404 });
  }
  
  movie.prizes = movie.prizes.filter(p => p.id !== prizeId);
  
  return NextResponse.json({ 
    message: 'Prize removed from movie successfully',
    movie
  });
}

