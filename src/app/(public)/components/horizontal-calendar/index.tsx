import type { FC } from 'react';
import { fetchPublicMatchesCountAction } from '../../(actions)';
import { PublicCalendar } from './PublicCalendar';

export const HorizontalCalendar: FC = async () => {
  const { matchesDates } = await fetchPublicMatchesCountAction();
  return (
    <PublicCalendar matchesDates={matchesDates} />
  );
};

export default HorizontalCalendar;
