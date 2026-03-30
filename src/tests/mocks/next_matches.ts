import { MATCH_STATUS } from '@/shared/enums';

export const nextMatches = [
  {
    id: 'du37',
    tournament: {
      name: 'Torneo Jóvenes Promesas',
      permalink: 'torneo-jovenes-promesas',
      currentWeek: 2,
    },
    localTeam: {
      id: 'fi38',
      name: 'Atlas',
      permalink: 'atlas',
      category: '2022',
      format: '9',
      imageUrl: 'https://clouinary.com/atlas.webp',
    },
    visitorTeam: {
      id: 'f93k',
      name: 'Chivas',
      permalink: 'chivas',
      imageUrl: 'https://clouinary.com/chivas.webp',
    },
    localScore: 0,
    visitorScore: 0,
    status: MATCH_STATUS.SCHEDULED,
    week: 1,
    place: 'Soccer Field',
    matchDate: new Date('2022-06-02T18:00:00.000'),
  },
];

export const matchesDates = nextMatches.map((match) => ({
  id: match.id,
  matchDate: match.matchDate.toISOString(),
}));
