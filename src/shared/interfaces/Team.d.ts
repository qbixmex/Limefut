export interface Team {
  id: string;
  name: string;
  permalink: string;
  headquarters: string | null;
  imageUrl: string | null;
  imagePublicID: string | null;
  division: string | null;
  group: string | null;
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
  division: string;
  group: string;
  country: string;
  city: string;
  state: string;
  emails: string[];
  address: string | null;
  active: boolean;
  tournamentId: string;
  coachId?: string | null;
}
