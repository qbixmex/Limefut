import { fetchCategoriesAction } from '../(actions)';
import { CategoriesSelector } from '../../(components)/categories-selector';
import { TournamentsSelector } from '../../(components)/tournaments-selector';
import { fetchTournamentsAction } from '@/shared/actions/fetchTournamentsAction';

export const SearchParamsSelectors = async () => {
  const { tournaments } = await fetchTournamentsAction();

  const { categories } = await fetchCategoriesAction();

  return (
    <section className="w-full lg:w-1/2 2xl:w-full 2xl:max-w-[600px]">
      <div className="space-y-5">
        <TournamentsSelector tournaments={tournaments} />
        <CategoriesSelector categories={categories} />
      </div>
    </section>
  );
};
