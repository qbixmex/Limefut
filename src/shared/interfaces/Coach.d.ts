export interface Coach {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  age: number | null;
  nationality: string | null;
  imageUrl: string | null;
  imagePublicID: string | null;
  description: string | null;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CoachSeed {
  name: string;
  email: string;
  phone: string | null;
  age: number | null;
  nationality: string | null;
  imageUrl: string | null;
  imagePublicID: string | null;
  description: string | null;
  active: boolean;
}