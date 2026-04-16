export interface Field {
  id?: string;
  name: string;
  permalink: string;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  address?: string | null;
  map?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
