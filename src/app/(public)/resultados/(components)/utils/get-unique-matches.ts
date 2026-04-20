import type { MatchType } from '../../(actions)/fetchResultsAction';

export const getUniqueMatches = (matches: MatchType[]) => {
  const matchesByWeek = matches.reduce((grouped, match) => {
    const week = match.week;
    if (week === null) return grouped;
    if (!grouped[week]) grouped[week] = [];
    grouped[week].push(match);
    return grouped;
  }, {} as Record<number, typeof matches>);

  return matchesByWeek;
};
