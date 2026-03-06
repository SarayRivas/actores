import { NextRequest, NextResponse } from 'next/server';
import { Movie } from '@/types/actor';

const EXTERNAL_API_URL = 'http://localhost:3000/api/v1/movies';

let movies: Movie[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const response = await fetch(`${EXTERNAL_API_URL}/${id}`);
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.log('External API unavailable, using in-memory storage');
  }
  
  const movie = movies.find(m => m.id === id);
  if (!movie) {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
  }
  
  return NextResponse.json(movie);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    
    try {
      const response = await fetch(`${EXTERNAL_API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (error) {
      console.log('External API unavailable, using in-memory storage');
    }

    const index = movies.findIndex(m => m.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }
    
    movies[index] = { ...movies[index], ...body };
    return NextResponse.json(movies[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const response = await fetch(`${EXTERNAL_API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.log('External API unavailable, using in-memory storage');
  }

  const index = movies.findIndex(m => m.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
  }
  
  movies = movies.filter(m => m.id !== id);
  return NextResponse.json({ success: true });
}

