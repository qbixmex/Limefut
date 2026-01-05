import { type FC } from 'react';
import { fetchTournamentsAction } from '@/shared/actions/fetchTournamentsAction';
import TournamentsSelector from '../../(components)/tournaments-selector';
// import { SelectTournament } from "@/shared/components/select-tournament";

export const TournamentsWrapper: FC = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return (
    <section className="mb-10">
      <TournamentsSelector tournaments={tournaments} />
    </section>
  );
};

export default TournamentsWrapper;
