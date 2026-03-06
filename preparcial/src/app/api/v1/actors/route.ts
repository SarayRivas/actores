import { NextRequest, NextResponse } from 'next/server';
import { Actor } from '@/types/actor';

const EXTERNAL_API_URL = 'http://localhost:3000/api/v1/actors';


let actors: Actor[] = [];

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
  
 
  return NextResponse.json(actors);
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
    

    const newActor: Actor = {
      id: Date.now().toString(),
      ...body
    };
    actors.push(newActor);
    return NextResponse.json(newActor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}


export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    try {
     
      const response = await fetch(`${EXTERNAL_API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (error) {
      console.log('External API unavailable, using in-memory storage');
    }
    

    const index = actors.findIndex(a => a.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Actor not found' }, { status: 404 });
    }
    
    actors[index] = { ...actors[index], ...updateData };
    return NextResponse.json(actors[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}


export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  
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

  
  const index = actors.findIndex(a => a.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Actor not found' }, { status: 404 });
  }
  
  actors = actors.filter(a => a.id !== id);
  return NextResponse.json({ success: true });
}

