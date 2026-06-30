import { fetchTournamentsAction } from '@/shared/actions/fetchTournamentsAction';
import { TournamentsSelector } from '@/shared/components/tournaments-selector';
import { CategoriesSelector } from '@/shared/components/categories-selector';
import { fetchCategoriesAction } from '@/shared/actions/fetch-categories.action';
import { showToast } from '@/lib/show-toast';

export const SearchParamsSelectors = async () => {
  const { tournaments } = await fetchTournamentsAction();
  const { ok, message, categories } = await fetchCategoriesAction();

  if (!ok) {
    showToast({ type: 'error', message });
  }

  return (
    <section className="w-full lg:w-1/2 2xl:w-full 2xl:max-w-[600px]">
      <div className="space-y-5">
        <TournamentsSelector tournaments={tournaments} />
        <CategoriesSelector categories={categories} />
      </div>
    </section>
  );
};
