type ANNOUNCEMENT_TYPE = {
  id: string;
  title: string;
  permalink: string;
  publishedDate: Date;
  imageUrl: string | null;
  description: string;
};

export const announcements: ANNOUNCEMENT_TYPE[] = [
  {
    id: 'fk38',
    title: 'Games post posted',
    permalink: 'games-post-posted',
    publishedDate: new Date('2025-04-15T08:22:15.542Z'),
    imageUrl: 'https://res.cloudinary.com/username/image/upload/v123456789/image-2020-05-02_06-15-22.567.webp',
    description: 'Games are post posted caused by weather conditions',
  },
  {
    id: 'xl28',
    title: 'Players must come with uniforms',
    permalink: 'players must come with uniforms',
    publishedDate: new Date('2025-03-08T16:08:18.432Z'),
    imageUrl: 'https://res.cloudinary.com/username/image/upload/v123456789/image-2022-02-08_20-05-12.456.webp',
    description: 'Games are post posted caused by weather conditions',
  },
];
