import { type FC } from 'react';
import { fetchTournamentsForStandingsAction } from '../(actions)/fetchTournamentsForStandingsAction';
import TournamentsSelector from '../../(components)/tournaments-selector';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const TournamentsWrapper: FC = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userRoles = session?.user.roles as string[];
  const { tournaments } = await fetchTournamentsForStandingsAction(userRoles);

  return (
    <section className="mb-10">
      <TournamentsSelector tournaments={tournaments} />
    </section>
  );
};

export default TournamentsWrapper;
