'use client';

import { type FC, type ReactNode } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import type { TOURNAMENT_TYPE } from '../(actions)/fetch-tournament.action';
import { useCreateTournament } from './use-create-tournament';
import { FormFields } from '../(components)/form-fields';

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  tournament?: TOURNAMENT_TYPE;
  categorySlot: ReactNode;
}>;

export const CreateTournamentForm: FC<Props> = ({
  authenticatedUserId,
  authenticatedUserRoles,
  categorySlot,
}) => {
  const { form, onSubmit, handleNavigateBack } = useCreateTournament({
    authenticatedUserId,
    authenticatedUserRoles,
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
            aria-label="Crear torneo"
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
