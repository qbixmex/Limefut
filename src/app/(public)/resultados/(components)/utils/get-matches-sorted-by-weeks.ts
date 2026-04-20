import type { MatchType } from '../../(actions)/fetchResultsAction';

export const getMatchesSortedByWeeks = (matches: Record<number, MatchType[]>) => {
  const sortedWeeks = Object.keys(matches)
    .map(Number)
    .sort((a, b) => a - b);

  return sortedWeeks;
};
