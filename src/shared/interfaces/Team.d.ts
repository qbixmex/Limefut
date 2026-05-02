export interface Team {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
  imagePublicID: string | null;
  category: string | null;
  format: string | null;
  gender: GENDER_TYPE;
  country: string | null;
  city: string | null;
  state: string | null;
  emails: string[];
  address: string | null;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
