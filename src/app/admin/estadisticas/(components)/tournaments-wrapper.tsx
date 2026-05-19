import { type FC } from 'react';
import { SearchParamsSelectors } from '@/shared/components/search-params-selectors';

export const TournamentsWrapper: FC = async () => {
  return (
    <section className="w-full lg:w-1/2 2xl:w-full 2xl:max-w-[600px] mb-10">
      <SearchParamsSelectors />
    </section>
  );
};

export default TournamentsWrapper;
