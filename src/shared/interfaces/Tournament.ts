export interface Tournament {
  id: string;
  name: string;
  permalink: string;
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
