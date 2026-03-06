import { NextRequest, NextResponse } from 'next/server';
import { Prize } from '@/types/actor';

const EXTERNAL_API_URL = 'http://localhost:3000/api/v1/prizes';

let prizes: Prize[] = [];

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
  
  const prize = prizes.find(p => p.id === id);
  if (!prize) {
    return NextResponse.json({ error: 'Prize not found' }, { status: 404 });
  }
  
  return NextResponse.json(prize);
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

    const index = prizes.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Prize not found' }, { status: 404 });
    }
    
    prizes[index] = { ...prizes[index], ...body };
    return NextResponse.json(prizes[index]);
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

  const index = prizes.findIndex(p => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Prize not found' }, { status: 404 });
  }
  
  prizes = prizes.filter(p => p.id !== id);
  return NextResponse.json({ success: true });
}

