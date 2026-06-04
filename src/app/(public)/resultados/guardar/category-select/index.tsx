import { fetchPublicCategoriesAction } from '../../(actions)/fetchPublicCategoriesAction';
import { CategoryFormSelect } from './category-form-select';

export const CategorySelect = async () => {
  const { categories } = await fetchPublicCategoriesAction();

  return (
    <CategoryFormSelect categories={categories} />
  );
};
