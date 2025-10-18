export interface Tournament {
  id?: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
  imagePublicID: string | null;
  description: string;
  country: string;
  state: string;
  city: string;
  season: string;
  startDate: Date;
  endDate: Date;
  active: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface TournamentSeed {
  name: string;
  permalink: string;
  imageUrl: string | null;
  imagePublicID: string | null;
  description: string;
  country: string;
  state: string;
  city: string;
  season: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
}
