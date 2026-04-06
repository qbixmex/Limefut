type AnnouncementType = {
  id: string;
  title: string;
  permalink: string;
  publishedDate: Date;
  description: string;
};

export const announcements: AnnouncementType[] = [
  {
    id: 'fk38',
    title: 'Games post posted',
    permalink: 'games-post-posted',
    publishedDate: new Date('2025-04-15T08:22:15.542Z'),
    description: 'Games are post posted caused by weather conditions',
  },
  {
    id: 'xl28',
    title: 'Players must come with uniforms',
    permalink: 'players must come with uniforms',
    publishedDate: new Date('2025-03-08T16:08:18.432Z'),
    description: 'Games are post posted caused by weather conditions',
  },
];
