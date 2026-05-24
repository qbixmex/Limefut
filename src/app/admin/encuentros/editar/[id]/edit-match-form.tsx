'use client';

import { type FC } from 'react';
import { Form } from '@/components/ui/form';
import { FormFields } from '../../(components)/form-fields';
import { useEditMatch } from './use-edit-match';
import type { MATCH_TYPE } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import type { TOURNAMENT_TYPE } from '@/app/admin/encuentros/(actions)/fetch-tournaments-for-match.action';
import type { TEAM_TYPE } from '@/app/admin/encuentros/(actions)/fetch-teams-for-match-edit.action';
import type { CATEGORY_TYPE } from '@/app/admin/encuentros/(actions)/fetch-categories-for-match.action';
import { Button } from '@/components/ui/button';
import { MATCH_STATUS } from '@/shared/enums';
import { UpdateMatchScore } from '../../(components)/form-fields/update-match-score';
import { LoaderCircle } from 'lucide-react';

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  tournaments: TOURNAMENT_TYPE[];
  categories: CATEGORY_TYPE[];
  teams: TEAM_TYPE[];
  match: MATCH_TYPE;
}>;

export const EditMatchForm: FC<Props> = ({
  tournaments,
  categories,
  teams,
  match,
  authenticatedUserId,
  authenticatedUserRoles,
}) => {
  const {
    form,
    onSubmit,
    handleNavigateBack,
    hiddenScores,
    setHiddenScores,
    isModifyingScores,
    setIsModifyingScores,
  } = useEditMatch({
    authenticatedUserId,
    authenticatedUserRoles,
    match,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormFields
          match={match}
          tournaments={tournaments}
          categories={categories}
          teams={teams}
          hiddenScores={hiddenScores}
        />

        <section className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={handleNavigateBack}
          >
            cancelar
          </Button>

          {hiddenScores && match.status === MATCH_STATUS.COMPLETED && (
            <Button
              type="button"
              variant="outline-info"
              onClick={() => {
                setIsModifyingScores(true);
                setHiddenScores(false);
              }}
              className="absolute top-5 right-5"
            >
              modificar marcadores
            </Button>
          )}

          {!hiddenScores && match?.status === MATCH_STATUS.COMPLETED && (
            <UpdateMatchScore
              match={match}
              setHiddenScores={(value) => {
                setHiddenScores(value);
                setIsModifyingScores(false);
              }}
            />
          )}

          {!isModifyingScores && (
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
          )}
        </section>
      </form>
    </Form>
  );
};
