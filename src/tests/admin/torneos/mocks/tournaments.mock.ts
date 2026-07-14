import type { TOURNAMENT_TYPE } from '@/app/admin/torneos/(actions)/fetch-tournaments.action';

export const tournaments: TOURNAMENT_TYPE[] = [
  {
    id: '9dfc94ab-1171-492a-b059-f5baec39d256',
    name: 'Torneo jóvenes promesas',
    permalink: 'torneo-jovenes-promesas',
    imageUrl: null,
    season: '2026-apertura',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-06-01'),
    active: true,
    categoriesQuantity: 5,
  },
  {
    id: 'dcebcd1b-d0ff-40ea-b3c2-3179a89e864d',
    name: 'Jóvenes Cachorros',
    permalink: 'jovenes-cachorros',
    imageUrl: null,
    season: '2026-clausura',
    startDate: new Date('2026-09-01'),
    endDate: new Date('2026-12-22'),
    active: false,
    categoriesQuantity: 8,
  },
];
