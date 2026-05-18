import { fetchTournamentsAction } from '@/shared/actions/fetchTournamentsAction';
import { TournamentsSelector } from '@/shared/components/tournaments-selector';
import { CategoriesSelector } from '@/shared/components/categories-selector';

export const SearchParamsSelectors = async () => {
  const { tournaments } = await fetchTournamentsAction();
  const categories = (tournaments.length > 0)
    ? tournaments.map((t) => ({
      id: t.id,
      category: t.category,
    }))
    : [];

  return (
    <section className="w-full lg:w-1/2 2xl:w-full 2xl:max-w-[600px]">
      <div className="space-y-5">
        <TournamentsSelector tournaments={tournaments} />
        <CategoriesSelector categories={categories} />
      </div>
    </section>
  );
};
