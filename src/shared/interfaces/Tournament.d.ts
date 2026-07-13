export interface Tournament {
  id?: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
  imagePublicID: string | null;
  description: string | null;
  country: string | null;
  cities: string[];
  season: string | null;
  startDate: Date;
  endDate: Date;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
