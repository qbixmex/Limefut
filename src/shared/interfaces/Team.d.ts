export interface Team {
  id: string;
  name: string;
  permalink: string;
  headquarters: string | null;
  imageUrl: string | null;
  imagePublicID: string | null;
  category: string | null;
  format: string | null;
  gender?: 'male' | 'female';
  country: string | null;
  city: string | null;
  state: string | null;
  emails: string[];
  address: string | null;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TeamSeed {
  name: string;
  permalink: string;
  headquarters: string;
  imageUrl: string | null;
  imagePublicID: string | null;
  category: string;
  format: string;
  gender?: 'male' | 'female';
  country: string;
  city: string;
  state: string;
  emails: string[];
  address: string | null;
  active: boolean;
  tournamentId: string;
  coachId?: string | null;
}
