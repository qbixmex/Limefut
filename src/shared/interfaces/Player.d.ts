export interface Player {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  birthday?: Date | null;
  nationality?: string | null;
  imageUrl: string | null;
  imagePublicID: string | null;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
