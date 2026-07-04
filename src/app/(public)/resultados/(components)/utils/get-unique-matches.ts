import type { MATCH_TYPE } from '../../(actions)/fetch-public-results.action';

export const getUniqueMatches = (matches: MATCH_TYPE[]) => {
  const matchesByWeek = matches.reduce((grouped, match) => {
    const week = match.week;
    if (week === null) return grouped;
    if (!grouped[week]) grouped[week] = [];
    grouped[week].push(match);
    return grouped;
  }, {} as Record<number, typeof matches>);

  return matchesByWeek;
};
