'use client';

import type { FC } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import type { User } from '@/shared/interfaces';
import { LoaderCircle } from 'lucide-react';
import { FormFields } from '../../(components)/form-fields';
import { useEditUser } from './use-edit-user';

type Props = Readonly<{
  user: User;
}>;

export const EditUserForm: FC<Props> = ({ user }) => {
  const { form, onSubmit, route } = useEditUser(user);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormFields />

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={() => route.back()}
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
              <span>actualizar</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
