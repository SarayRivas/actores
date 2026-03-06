'use client';

import MovieForm from '@/components/MovieForm';

export default function CreateMoviePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <MovieForm esEdicion={false} />
    </div>
  );
}

