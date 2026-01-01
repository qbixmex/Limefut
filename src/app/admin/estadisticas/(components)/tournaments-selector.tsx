import { type FC } from 'react';
import { fetchTournamentsAction } from '@/shared/actions/fetchTournamentsAction';
import { SelectTournament } from "@/shared/components/select-tournament";

export const TournamentsSelector: FC = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return (
    <section className="mb-10">
      <SelectTournament tournaments={tournaments} />
    </section>
  );
};

export default TournamentsSelector;
