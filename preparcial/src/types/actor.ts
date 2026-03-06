export interface Prize {
  id: string;
  name: string;
  category: string;
  year: number;
  status: string;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  duration: number;
  country: string;
  releaseDate: string;
  popularity: number;
  actors?: Actor[];
}

export interface Actor {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
  movies?: Movie[];
}

export type ActorInput = Omit<Actor, 'id' | 'movies'>;
export type MovieInput = Omit<Movie, 'id' | 'prizes' | 'actors'>;
export type PrizeInput = Omit<Prize, 'id'>;

