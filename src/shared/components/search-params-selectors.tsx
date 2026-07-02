import type { TOURNAMENT_TYPE } from '@/shared/actions/fetchTournamentsAction';
import { fetchTournamentsAction } from '@/shared/actions/fetchTournamentsAction';
import { TournamentsSelector } from '@/shared/components/tournaments-selector';
import { CategoriesSelector } from '@/shared/components/categories-selector';
import { fetchCategoriesAction } from '@/shared/actions/fetch-categories.action';
import type { CATEGORY_TYPE } from '@/app/(public)/resultados/(actions)/fetchPublicCategoriesAction';

export const SearchParamsSelectors = async () => {
  const responseTournaments = await fetchTournamentsAction();
  const responseCategories = await fetchCategoriesAction();

  const tournaments: TOURNAMENT_TYPE[] = (responseTournaments.ok)
    ? responseTournaments.tournaments
    : [];

  const categories: CATEGORY_TYPE[] = (responseCategories.ok)
    ? responseCategories.categories
    : [];

  return (
    <section className="w-full lg:w-1/2 2xl:w-full 2xl:max-w-[600px]">
      <div className="space-y-5">
        {
          (tournaments.length > 0)
            ? <TournamentsSelector tournaments={tournaments} />
            : <p className="text-red-500"><b>No hay torneos para mostrar</b></p>
        }
        {
          (categories.length > 0)
            ? <CategoriesSelector categories={categories} />
            : <p className="text-red-500"><b>No hay categorías para mostrar</b></p>
        }
      </div>
    </section>
  );
};
