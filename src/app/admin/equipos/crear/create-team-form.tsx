'use client';

import type { ReactNode, FC } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useCreateTeam } from '../crear/use-create-team';
import { FormFields } from '../(components)/form-fields';

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  tournamentSlot: ReactNode;
  categorySlot: ReactNode;
  coachesSlot: ReactNode;
  fieldsSlot: ReactNode;
}>;

export const CreateTeamForm: FC<Props> = ({
  authenticatedUserId,
  authenticatedUserRoles,
  tournamentSlot,
  categorySlot,
  coachesSlot,
  fieldsSlot,
}) => {
  const { form, onSubmit, handleNavigateBack } = useCreateTeam({
    authenticatedUserId,
    authenticatedUserRoles,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormFields
          tournamentSlot={tournamentSlot}
          categorySlot={categorySlot}
          coachesSlot={coachesSlot}
          fieldsSlot={fieldsSlot}
        />

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
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span className="text-sm italic">Espere</span>
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              <span>crear</span>
            )}
          </Button>
        </div>
      </form>
    </Form >
  );
};
