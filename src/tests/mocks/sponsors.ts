import { ALIGNMENT } from '@/shared/enums';

type Sponsor = {
  id: string;
  name: string;
  imageUrl: string;
  alignment: string;
  position: number;
  url?: string | null;
};

export const sponsors: Sponsor[] = [
  {
    id: 'aX6l',
    name: 'Rexona',
    imageUrl: 'https://rexona.com/rexona.png',
    url: 'https://rexona.com/',
    alignment: ALIGNMENT.RIGHT,
    position: 1,
  },
  {
    id: 'b6Y8',
    name: 'Gatorade',
    imageUrl: 'https://gatorade.com/gatorade.png',
    url: 'https://gatorade.com/',
    alignment: ALIGNMENT.RIGHT,
    position: 2,
  },
];
