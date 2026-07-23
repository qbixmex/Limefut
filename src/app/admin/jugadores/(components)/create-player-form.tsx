'use client';

import type { FC } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { useCreatePlayer } from './use-create-player';
import { FormFields } from './form-fields';

type TeamType = {
  id: string;
  name: string;
};

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  teams: TeamType[];
}>;

export const CreatePlayerForm: FC<Props> = ({ authenticatedUserId, authenticatedUserRoles, teams }) => {
  const { form, onSubmit, handleNavigateBack } = useCreatePlayer({ authenticatedUserId, authenticatedUserRoles });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormFields teams={teams} />

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
            aria-label="Crear jugador"
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span
                  className="text-sm italic"
                  role="status"
                  aria-label="Enviando formulario"
                >
                  Espere
                </span>
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              <span>crear</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
