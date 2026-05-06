import { type FC } from 'react';
import { fetchTournamentsForStandingsAction } from '../(actions)/fetchTournamentsForStandingsAction';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { TournamentsSelector } from '@/app/admin/(components)/tournaments-selector';

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
