import { randomUUID } from 'node:crypto';
import { CreateCategoryForm } from '../(components)/create-category-form';

export const CreateCategoryView = async () => {
  return (
    <CreateCategoryForm
      key={randomUUID()}
    />
  );
};
