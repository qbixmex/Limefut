'use client';

import { type FC, type ReactNode } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { useEditTournament } from './use-edit-tournament';
import type { TOURNAMENT_TYPE } from '../../(actions)/fetch-tournament-for-edit.action';
import { FormFields } from '../../(components)/form-fields';

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  tournament: TOURNAMENT_TYPE;
  categorySlot: ReactNode;
}>;

export const EditTournamentForm: FC<Props> = ({
  authenticatedUserId,
  authenticatedUserRoles,
  tournament,
  categorySlot,
}) => {
  const { form, onSubmit, handleNavigateBack } = useEditTournament({
    authenticatedUserId,
    authenticatedUserRoles,
    tournament,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormFields categorySlot={categorySlot} />

        {/* Buttons */}
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
            aria-label="Guardar torneo"
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span
                  className="text-sm italic"
                  role="status"
                  aria-label="Enviando formulario"
                >Espere</span>
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              <span>guardar</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
