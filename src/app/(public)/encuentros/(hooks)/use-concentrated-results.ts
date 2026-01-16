'use client';

import { useEffect } from 'react';
import type { ResultType, TeamType } from '../(actions)/fetchResultsAction';

export const useConcentratedResults = (results: ResultType[], teams: TeamType[]) => {
  const resultsMap = new Map();

  results.forEach((result) => {
    const localTeamId = teams.find((team) => team.name === result.localTeam.name)?.id;
    const visitorTeamId = teams.find((team) => team.name === result.visitorTeam.name)?.id;

    if (localTeamId && visitorTeamId) {
      const key = `${localTeamId}-${visitorTeamId}`;
      resultsMap.set(key, result);
    }
  });

  const getResultCell = (localTeamId: string, visitorTeamId: string) => {
    const key = `${localTeamId}-${visitorTeamId}`;
    const result = resultsMap.get(key);

    if (!result) {
      return { className: '', content: null, matchId: null };
    }

    const { localScore, visitorScore, status } = result;
    const content = `${localScore} - ${visitorScore}`;

    let className = '';

    switch (status) {
      case 'scheduled':
        className = 'status-scheduled';
        break;
      case 'completed':
        className = 'status-completed';
        break;
      case 'inProgress':
        className = 'status-in_progress';
        break;
      case 'postPosed':
        className = 'status-postposed';
        break;
      case 'canceled':
        className = 'status-canceled';
        break;
      default:
        className = '';
    }

    return {
      className,
      content,
      matchId: result.id,
    };
  };

  useEffect(() => {
    const cells = document.querySelectorAll('table tbody td[data-match]:not([data-match=""])');
    const handlers: { cell: Element; enter: EventListenerOrEventListenerObject; leave: EventListenerOrEventListenerObject }[] = [];

    cells.forEach(cell => {
      const enter = () => {
        const matchId = cell.getAttribute('data-match');
        const localId = cell.getAttribute('data-match-local');
        const visitorId = cell.getAttribute('data-match-visitor');

        if (matchId) {
          const allMatchCells = document.querySelectorAll(`table tbody td[data-match="${matchId}"]`);
          allMatchCells.forEach(c => c.classList.add('highlight-match'));
        }

        if (localId) {
          const localRow = document.querySelector(`table tbody tr[data-team="${localId}"]`);
          const label = localRow?.querySelector('td[data-row-label]');
          if (label) label.classList.add('highlight-team');
        }

        if (visitorId) {
          const visitorRow = document.querySelector(`table tbody tr[data-team="${visitorId}"]`);
          const label = visitorRow?.querySelector('td[data-row-label]');
          if (label) label.classList.add('highlight-team');
        }
      };

      const leave = () => {
        const matchId = cell.getAttribute('data-match');
        const localId = cell.getAttribute('data-match-local');
        const visitorId = cell.getAttribute('data-match-visitor');

        if (matchId) {
          const allMatchCells = document.querySelectorAll(`table tbody td[data-match="${matchId}"]`);
          allMatchCells.forEach(c => c.classList.remove('highlight-match'));
        }

        if (localId) {
          const localRow = document.querySelector(`table tbody tr[data-team="${localId}"]`);
          const label = localRow?.querySelector('td[data-row-label]');
          if (label) label.classList.remove('highlight-team');
        }

        if (visitorId) {
          const visitorRow = document.querySelector(`table tbody tr[data-team="${visitorId}"]`);
          const label = visitorRow?.querySelector('td[data-row-label]');
          if (label) label.classList.remove('highlight-team');
        }
      };

      cell.addEventListener('mouseenter', enter);
      cell.addEventListener('mouseleave', leave);
      handlers.push({ cell, enter, leave });
    });

    return () => {
      handlers.forEach(({ cell, enter, leave }) => {
        cell.removeEventListener('mouseenter', enter);
        cell.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  return {
    getResultCell,
  };
};
