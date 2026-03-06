import { NextRequest, NextResponse } from 'next/server';
import { Movie, MovieInput } from '@/types/actor';

const EXTERNAL_API_URL = 'http://localhost:3000/api/v1/movies';

const movies: Movie[] = [];

export async function GET() {
  try {
    const response = await fetch(EXTERNAL_API_URL);
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.log('External API unavailable, using in-memory storage');
  }
  
  return NextResponse.json(movies);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    try {
      const response = await fetch(EXTERNAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
      }
    } catch (error) {
      console.log('External API unavailable, using in-memory storage');
    }

    const newMovie: Movie = {
      id: Date.now().toString(),
      ...body,
      prizes: [],
      actors: [],
    };
    movies.push(newMovie);
    return NextResponse.json(newMovie, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

