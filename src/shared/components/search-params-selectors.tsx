import type { FC } from 'react';
import { fetchTournamentsForSelectorAction } from '@/shared/actions/fetch-tournaments-for-selector.action';
import { TournamentsSelector } from '@/shared/components/tournaments-selector';
import { CategoriesSelector } from './categories-selector';

type Props = Readonly<{
  tournamentPromise: Promise<{
    tournament: string | undefined;
  }>;
}>;

export const SearchParamsSelectors: FC<Props> = async ({ tournamentPromise }) => {
  const tournament = (await tournamentPromise).tournament;
  const responseTournaments = await fetchTournamentsForSelectorAction();

  const tournaments = responseTournaments.tournaments.map(tournament => ({
    id: tournament.id,
    name: tournament.name,
    permalink: tournament.permalink,
  }));

  return (
    <section className="w-full lg:w-1/2 2xl:w-full 2xl:max-w-[600px]">
      <div className="space-y-5">
        {
          (tournaments.length > 0)
            ? <TournamentsSelector tournaments={tournaments} />
            : <p className="text-red-500"><b>No hay torneos para mostrar</b></p>
        }
        <CategoriesSelector tournament={tournament} />
      </div>
    </section>
  );
};
