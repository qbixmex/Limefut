'use client';

import type { FC } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import type { Category } from '@/shared/interfaces';
import { useEditCategory } from './use-edit-category';
import { FormFields } from './form-fields';

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | undefined;
  category: Category;
}>;

export const EditCategoryForm: FC<Props> = (props) => {
  const { form, onSubmit, handleNavigateBack } = useEditCategory(props);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 h-full flex flex-col"
      >
        <FormFields />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={handleNavigateBack}
          >
            cancelar
          </Button>
          <Button
            type="submit"
            variant="outline-primary"
            size="lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span className="text-sm italic">Espere</span>
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
