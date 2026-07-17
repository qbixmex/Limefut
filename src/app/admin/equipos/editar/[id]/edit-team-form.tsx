'use client';

import type { ReactNode, FC } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormFields } from '../../(components)/form-fields';
import type { TEAM_TYPE } from '../../(actions)/fetch-team-for-edit.action';
import { useEditTeam } from './use-edit-team';

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  team: TEAM_TYPE;
  tournamentSlot: ReactNode;
  categorySlot: ReactNode;
  coachesSlot: ReactNode;
  fieldsSlot: ReactNode;
}>;

export const EditTeamForm: FC<Props> = ({
  authenticatedUserId,
  authenticatedUserRoles,
  team,
  tournamentSlot,
  categorySlot,
  coachesSlot,
  fieldsSlot,
}) => {
  const { form, onSubmit, handleNavigateBack } = useEditTeam({
    authenticatedUserId,
    authenticatedUserRoles,
    team,
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
              <span>guardar</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
