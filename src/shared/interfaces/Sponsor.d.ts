export interface Sponsor {
  id: string;
  name: string;
  url?: string | null;
  imageUrl: string;
  imagePublicId: string;
  startDate?: Date;
  endDate?: Date;
  position: string;
  clicks: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
