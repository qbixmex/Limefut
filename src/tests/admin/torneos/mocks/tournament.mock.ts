import type { TOURNAMENT_TYPE } from '@/app/admin/torneos/(actions)/fetch-tournament.action';

export const tournamentMock: TOURNAMENT_TYPE = {
  id: '17834fc4-afd8-490a-b07d-88d62e601521',
  name: 'Torneo Jóvenes Promesas',
  permalink: 'torneo-jovenes-promesas',
  imageUrl: null,
  imagePublicID: null,
  description: 'Nostrud ea aliquip laboris ea commodo aliquip consectetur minim ex. Officia irure cillum et aliqua magna culpa sit sunt. Qui exercitation tempor sint laboris duis ipsum irure Lorem reprehenderit consequat eu. Ea consectetur consequat excepteur commodo nulla sit irure. Dolore excepteur laborum laboris aliquip. Dolore occaecat sunt minim commodo do ex.',
  country: 'México',
  cities: ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Tonalá'],
  season: 'clausura-2026',
  startDate: new Date('2026-09-01T00:00:00.000Z'),
  endDate: new Date('2026-12-22T00:00:00.000Z'),
  active: true,
  createdAt: new Date('2026-08-08T14:32:15.124Z'),
  updatedAt: new Date('2026-08-08T14:35:42.735Z'),
  categories: [
    {
      id: '5f42886e-ba04-43c8-80ca-943521838880',
      name: 'Secundaria Varonil',
      permalink: 'secundaria-varonil',
    },
    {
      id: '657f11d1-59d0-494f-bc4e-6021f2d7040a',
      name: 'Secundaria Femenil',
      permalink: 'secundaria-femenil',
    },
  ],
  teamsQuantity: 12,
};
