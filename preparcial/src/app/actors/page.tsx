import ActorsList from '@/components/ActorList';

export default function ActorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-zinc-800">Lista de Actores</h1>
      <ActorsList />
    </div>
  );
}

