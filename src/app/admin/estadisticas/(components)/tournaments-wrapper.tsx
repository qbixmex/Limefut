import { type FC } from 'react';
import { SearchParamsSelectors } from '@/shared/components/search-params-selectors';

type Props = Readonly<{
  tournamentPromise: Promise<{
    tournament: string | undefined;
  }>;
}>;

export const TournamentsWrapper: FC<Props> = async ({ tournamentPromise }) => {
  return (
    <section className="w-full lg:w-1/2 2xl:w-full 2xl:max-w-[600px] mb-10">
      <SearchParamsSelectors tournamentPromise={tournamentPromise} />
    </section>
  );
};

export default TournamentsWrapper;
