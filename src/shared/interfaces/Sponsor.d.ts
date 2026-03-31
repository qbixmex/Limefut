export interface Sponsor {
  id?: string;
  name: string;
  url?: string | null;
  imageUrl: string;
  imagePublicId: string;
  startDate?: Date | null;
  endDate?: Date | null;
  position: string;
  clicks: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
