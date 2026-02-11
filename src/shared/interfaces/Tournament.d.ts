export interface Tournament {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
  imagePublicID: string | null;
  description: string | null;
  category: string | null;
  format: string | null;
  gender: GENDER_TYPE;
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
