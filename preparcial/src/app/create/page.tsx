'use client';

import ActorForm from '@/components/ActorForm';

export default function CreateActorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ActorForm esEdicion={false} />
    </div>
  );
}

