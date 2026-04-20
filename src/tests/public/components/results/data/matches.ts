type Match = {
  id: string;
  localScore: number;
  visitorScore: number;
  matchDate: Date | null;
  week: number;
  status: string;
  place: string | null;
  tournament: {
    name: string;
    permalink: string;
    category: string;
    format: string;
  };
  local: {
    id: string;
    name: string;
    permalink: string;
  };
  visitor: {
    name: string;
    permalink: string;
  };
  penaltyShootout: {
    localGoals: number;
    visitorGoals: number;
  } | null;
};

export const matches: Match[] = [
  {
    id: '20e66524-d3fc-447f-ae18-2c64a27b5efe',
    localScore: 2,
    visitorScore: 0,
    matchDate: new Date('2025-06-08T20:00:00.000Z'),
    week: 10,
    status: 'completed',
    place: 'Unidad Deportiva Auditorio',
    tournament: {
      name: 'Copa jóvenes promesas',
      permalink: 'copa-jovenes-promesas',
      category: 'secundaria-femenil',
      format: '7',
    },
    local: {
      id: '08c95a94-67d1-4642-b05e-1e804189b849',
      name: 'Atlas Chapalita',
      permalink: 'atlas-chapalita',
    },
    visitor: {
      name: 'Leones Base Aerea',
      permalink: 'leones-base-aerea',
    },
    penaltyShootout: null,
  },
  {
    id: '9b6d14b6-0132-417e-b736-a238164a3ad2',
    localScore: 0,
    visitorScore: 0,
    matchDate: new Date('2025-06-08T21:00:00.000Z'),
    week: 10,
    status: 'scheduled',
    place: 'Colegio Aleman',
    tournament: {
      name: 'Copa jóvenes promesas',
      permalink: 'copa-jovenes-promesas',
      category: 'secundaria-femenil',
      format: '7',
    },
    local: {
      id: 'cae6ca31-5cd2-4743-886c-a34845145758',
      name: 'Colegio Tepeyac',
      permalink: 'colegio-tepeyac',
    },
    visitor: {
      name: 'Club Hormigas',
      permalink: 'club-hormigas',
    },
    penaltyShootout: null,
  },
];

export const matchesWithoutPlaces: Match[] = [
  {
    id: 'a09c5e09-526e-432c-8de8-edb384606f54',
    localScore: 0,
    visitorScore: 0,
    matchDate: null,
    week: 0,
    status: 'scheduled',
    place: null,
    tournament: {
      name: 'Copa jóvenes promesas',
      permalink: 'copa-jovenes-promesas',
      category: 'secundaria-varonil',
      format: '7',
    },
    local: {
      id: '08c95a94-67d1-4642-b05e-1e804189b849',
      name: 'Chivas',
      permalink: 'chivas',
    },
    visitor: {
      name: 'America',
      permalink: 'america',
    },
    penaltyShootout: null,
  },
  {
    id: '91b9843b-c759-476f-a318-6c862b35e44c',
    localScore: 0,
    visitorScore: 0,
    matchDate: null,
    week: 0,
    status: 'scheduled',
    place: 'Cruz Azul',
    tournament: {
      name: 'Copa jóvenes promesas',
      permalink: 'copa-jovenes-promesas',
      category: 'secundaria-varonil',
      format: '7',
    },
    local: {
      id: '77f580f3-480e-4d88-b6a5-4db19e37d080',
      name: 'Rayados',
      permalink: 'rayados',
    },
    visitor: {
      name: 'Tigres',
      permalink: 'tigres',
    },
    penaltyShootout: null,
  },
];

export const matchesWithoutDates: Match[] = [
  {
    id: 'b050feb8-3896-45ae-a023-684cc59d3a35',
    localScore: 0,
    visitorScore: 0,
    matchDate: null,
    week: 0,
    status: 'scheduled',
    place: 'Atlas Chapalita',
    tournament: {
      name: 'Copa jóvenes promesas',
      permalink: 'copa-jovenes-promesas',
      category: 'secundaria-varonil',
      format: '7',
    },
    local: {
      id: '8972728c-c686-4dac-9e24-4068869679c4',
      name: 'Atlas Chapalita',
      permalink: 'atlas-chapalita',
    },
    visitor: {
      name: 'Leones Base Aerea',
      permalink: 'leones-base-aerea',
    },
    penaltyShootout: null,
  },
  {
    id: 'dfa7ea0f-caf9-450d-9510-3f95453c87ac',
    localScore: 0,
    visitorScore: 0,
    matchDate: null,
    week: 0,
    status: 'scheduled',
    place: 'Colegio Tepeyac',
    tournament: {
      name: 'Copa jóvenes promesas',
      permalink: 'copa-jovenes-promesas',
      category: 'secundaria-varonil',
      format: '7',
    },
    local: {
      id: '32ab8ce7-cb41-4265-8e21-b6efd4bb26ea',
      name: 'Colegio Tepeyac',
      permalink: 'colegio-tepeyac',
    },
    visitor: {
      name: 'Club Hormigas',
      permalink: 'club-hormigas',
    },
    penaltyShootout: null,
  },
];

export const matchesWithPenalties: Match[] = [
  {
    id: 'd77a93f6-fd02-4657-bcf1-defbbad60c5f',
    localScore: 2,
    visitorScore: 2,
    matchDate: new Date('2025-06-08T20:00:00.000Z'),
    week: 10,
    status: 'completed',
    place: 'Colegio Altamira',
    tournament: {
      name: 'Copa jóvenes promesas',
      permalink: 'copa-jovenes-promesas',
      category: '2015',
      format: '7',
    },
    local: {
      id: 'e170e417-451f-4aa1-a926-932b00cfba1c',
      name: 'Halcones',
      permalink: 'Halcones',
    },
    visitor: {
      name: 'Leones Base Aerea',
      permalink: 'leones-base-aerea',
    },
    penaltyShootout: {
      localGoals: 3,
      visitorGoals: 2,
    },
  },
  {
    id: '5d5e3e45-faaa-4ceb-88d6-08bd3bcb49b9',
    localScore: 1,
    visitorScore: 1,
    matchDate: new Date('2025-06-08T20:00:00.000Z'),
    week: 10,
    status: 'scheduled',
    place: 'Colegio Aleman',
    tournament: {
      name: 'Copa jóvenes promesas',
      permalink: 'copa-jovenes-promesas',
      category: 'secundaria-femenil',
      format: '7',
    },
    local: {
      id: '',
      name: 'Colegio Tepeyac',
      permalink: 'colegio-tepeyac',
    },
    visitor: {
      name: 'Club Hormigas',
      permalink: 'club-hormigas',
    },
    penaltyShootout: {
      localGoals: 2,
      visitorGoals: 3,
    },
  },
];
