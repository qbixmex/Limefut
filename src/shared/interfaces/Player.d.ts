export interface Player {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  birthday?: Date | null;
  nationality?: string;
  imageUrl?: string;
  imagePublicID?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
