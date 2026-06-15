'use client';

import type { Match } from './(components)/match-card';

export const useBracketRound = () => {
  const getWinner = (match: Match | undefined): 'local' | 'visitor' | null => {
    if (!match) return null;
    if (match.status !== 'completed') return null;
    if (match.localScore === null || match.visitorScore === null) return null;

    if (!match.penaltyShoots) {
      if (match.localScore > match.visitorScore) {
        return 'local';
      }

      if (match.visitorScore > match.localScore) {
        return 'visitor';
      }
      if (match.localScore === match.visitorScore) {
        return null;
      }
    }

    if (match.penaltyShoots) {
      if (match.localTeam.id === match.penaltyShoots.winnerTeamId) {
        return 'local';
      }
      if (match.visitorTeam.id === match.penaltyShoots.winnerTeamId) {
        return 'visitor';
      }
    }

    return null;
  };

  const getLoser = (match: Match): 'local' | 'visitor' | null => {
    const winner = getWinner(match);
    if (!winner) return null;
    return winner === 'local' ? 'visitor' : 'local';
  };

  return {
    getWinner,
    getLoser,
  };
};
