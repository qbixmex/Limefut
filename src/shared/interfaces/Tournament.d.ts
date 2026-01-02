export interface Tournament {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
  imagePublicID: string | null;
  description: string | null;
  category: string | null;
  format: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  season: string | null;
  startDate: Date;
  endDate: Date;
  currentWeek: number | null;
  active: boolean;
  currentWeek: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TournamentSeed {
  name: string;
  permalink: string;
  imageUrl: string | null;
  imagePublicID: string | null;
  description: string;
  category: string;
  format: string;
  country: string;
  state: string;
  city: string;
  season: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
}
