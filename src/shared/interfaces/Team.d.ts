export interface Team {
  name: string;
  permalink: string;
  headquarters: string;
  imageUrl: string | null;
  imagePublicID: string | null;
  division: string;
  group: string;
  tournament: string;
  country: string;
  city: string;
  state: string;
  coach: string;
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
  tournament: string;
  country: string;
  city: string;
  state: string;
  coach: string;
  emails: string[];
  address: string;
  active: boolean;
}
