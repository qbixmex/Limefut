import type { FC } from 'react';
import { fetchTournamentsAction } from '../(actions)/fetchTournamentsAction';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { TournamentsList } from './tournaments-list';

export const TournamentsContainer: FC = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return (
    <>
      <ErrorHandler />
      <TournamentsList tournaments={tournaments} />
    </>
  );
};

export default TournamentsContainer;
