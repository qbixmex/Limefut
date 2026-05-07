import { TournamentsSelector } from '../../(components)/tournaments-selector';
import { fetchTournamentsAction } from '@/shared/actions/fetchTournamentsAction';

export const SearchParamsSelectors = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return (
    <section className="w-full lg:w-1/2 2xl:w-full 2xl:max-w-[600px]">
      <TournamentsSelector tournaments={tournaments} />
    </section>
  );
};
