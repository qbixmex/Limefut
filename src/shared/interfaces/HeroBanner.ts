export enum ALIGNMENT {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
};

export interface HeroBanner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imagePublicId: string;
  dataAlignment: string;
  showData: boolean;
  position: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
