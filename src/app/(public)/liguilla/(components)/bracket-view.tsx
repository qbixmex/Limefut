import type { FC } from 'react';
import { BracketRound } from './bracket-round';
import type { Match } from './match-card';

type BracketData = {
  quarterFinals: [Match, Match, Match, Match];
  semiFinals: [Match, Match];
  final: Match;
};

const MOCK_ORO: BracketData = {
  quarterFinals: [
    {
      id: 'oro-qf1',
      localTeam: { name: 'Águilas FC' },
      visitorTeam: { name: 'Toros FC' },
      localScore: 2,
      visitorScore: 1,
      matchDate: '8 de Junio, 2026',
      status: 'completed',
    },
    {
      id: 'oro-qf2',
      localTeam: { name: 'Leones FC' },
      visitorTeam: { name: 'Jaguares FC' },
      localScore: 0,
      visitorScore: 0,
      matchDate: '8 de Junio, 2026',
      penaltyShoots: { localGoals: 4, visitorGoals: 3 },
      status: 'completed',
    },
    {
      id: 'oro-qf3',
      localTeam: { name: 'Panteras FC' },
      visitorTeam: { name: 'Cobras FC' },
      localScore: 3,
      visitorScore: 0,
      matchDate: '9 de Junio, 2026',
      status: 'completed',
    },
    {
      id: 'oro-qf4',
      localTeam: { name: 'Halcones FC' },
      visitorTeam: { name: 'Dragones FC' },
      localScore: 1,
      visitorScore: 2,
      matchDate: '9 de Junio, 2026',
      status: 'completed',
    },
  ],
  semiFinals: [
    {
      id: 'oro-sf1',
      localTeam: { name: 'Águilas FC' },
      visitorTeam: { name: 'Leones FC' },
      localScore: 2,
      visitorScore: 1,
      matchDate: '12 de Junio, 2026',
      status: 'completed',
    },
    {
      id: 'oro-sf2',
      localTeam: { name: 'Dragones FC' },
      visitorTeam: { name: 'Panteras FC' },
      localScore: 0,
      visitorScore: 0,
      matchDate: '12 de Junio, 2026',
      penaltyShoots: { localGoals: 5, visitorGoals: 4 },
      status: 'completed',
    },
  ],
  final: {
    id: 'oro-final',
    localTeam: { name: 'Águilas FC' },
    visitorTeam: { name: 'Dragones FC' },
    localScore: 1,
    visitorScore: 0,
    matchDate: '14 de Junio, 2026',
    status: 'completed',
  },
};

const MOCK_PLATA: BracketData = {
  quarterFinals: [
    {
      id: 'plata-qf1',
      localTeam: { name: 'Rayos FC' },
      visitorTeam: { name: 'Titanes FC' },
      localScore: 2,
      visitorScore: 0,
      matchDate: '8 de Junio, 2026',
      status: 'completed',
    },
    {
      id: 'plata-qf2',
      localTeam: { name: 'Lobos FC' },
      visitorTeam: { name: 'Zorros FC' },
      localScore: 1,
      visitorScore: 1,
      matchDate: '8 de Junio, 2026',
      penaltyShoots: { localGoals: 3, visitorGoals: 2 },
      status: 'completed',
    },
    {
      id: 'plata-qf3',
      localTeam: { name: 'Linces FC' },
      visitorTeam: { name: 'Bucaneros FC' },
      localScore: 0,
      visitorScore: 2,
      matchDate: '9 de Junio, 2026',
      status: 'completed',
    },
    {
      id: 'plata-qf4',
      localTeam: { name: 'Cóndores FC' },
      visitorTeam: { name: 'Pumas FC' },
      localScore: 3,
      visitorScore: 1,
      matchDate: '9 de Junio, 2026',
      status: 'completed',
    },
  ],
  semiFinals: [
    {
      id: 'plata-sf1',
      localTeam: { name: 'Rayos FC' },
      visitorTeam: { name: 'Lobos FC' },
      localScore: 1,
      visitorScore: 2,
      matchDate: '12 de Junio, 2026',
      status: 'completed',
    },
    {
      id: 'plata-sf2',
      localTeam: { name: 'Bucaneros FC' },
      visitorTeam: { name: 'Cóndores FC' },
      localScore: 2,
      visitorScore: 2,
      matchDate: '12 de Junio, 2026',
      penaltyShoots: { localGoals: 4, visitorGoals: 3 },
      status: 'completed',
    },
  ],
  final: {
    id: 'plata-final',
    localTeam: { name: 'Lobos FC' },
    visitorTeam: { name: 'Bucaneros FC' },
    localScore: 0,
    visitorScore: 3,
    matchDate: '14 de Junio, 2026',
    status: 'completed',
  },
};

export const BracketView: FC = () => {
  return (
    <div className="flex flex-col gap-10">
      <BracketRound
        quarterFinals={MOCK_ORO.quarterFinals}
        semiFinals={MOCK_ORO.semiFinals}
        final={MOCK_ORO.final}
        groupName="Oro"
        variant="oro"
      />

      <div className="w-full h-px bg-gray-300 dark:bg-gray-700" />

      <BracketRound
        quarterFinals={MOCK_PLATA.quarterFinals}
        semiFinals={MOCK_PLATA.semiFinals}
        final={MOCK_PLATA.final}
        groupName="Plata"
        variant="plata"
      />
    </div>
  );
};
