export interface Team {
  id: string;
  name: string;
  permalink: string;
  headquarters: string;
  imageUrl: string | null;
  imagePublicID: string | null;
  division: string;
  group: string;
  country: string;
  city: string;
  state: string;
  emails: string[];
  address: string | null;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  tournamentId: string;
}

export interface TeamSeed {
  name: string;
  permalink: string;
  headquarters: string;
  imageUrl: string | null;
  imagePublicID: string | null;
  division: string;
  group: string;
  country: string;
  city: string;
  state: string;
  emails: string[];
  address: string;
  active: boolean;
  tournamentId: string;
  coachId?: string | null;
}
