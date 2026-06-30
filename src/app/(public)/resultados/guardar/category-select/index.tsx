import { fetchPublicCategoriesAction } from '../../(actions)/fetchPublicCategoriesAction';
import { CategoriesFormSelect } from './categories-form-select';

export const CategorySelect = async () => {
  const { categories } = await fetchPublicCategoriesAction();

  return (
    <CategoriesFormSelect categories={categories} />
  );
};
