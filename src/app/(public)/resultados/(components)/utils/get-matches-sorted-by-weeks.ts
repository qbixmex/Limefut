import type { MATCH_TYPE } from '../../(actions)/fetch-public-results.action';

export const getMatchesSortedByWeeks = (matches: Record<number, MATCH_TYPE[]>) => {
  const sortedWeeks = Object.keys(matches)
    .map(Number)
    .sort((a, b) => a - b);

  return sortedWeeks;
};
