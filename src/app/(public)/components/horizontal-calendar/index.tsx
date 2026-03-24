import type { FC } from 'react';
import { fetchPublicMatchesCountAction } from '../../(actions)';
import { PublicCalendar } from './PublicCalendar';

const TIME_ZONE = 'America/Mexico_City';

export const HorizontalCalendar: FC = async () => {
  const { matchesDates } = await fetchPublicMatchesCountAction({
    timeZone: TIME_ZONE,
  });
  return (
    <PublicCalendar matchesDates={matchesDates} />
  );
};

export default HorizontalCalendar;
