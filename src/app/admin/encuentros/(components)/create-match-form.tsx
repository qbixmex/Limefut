'use client';

import type { FC } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import type { TOURNAMENT_TYPE } from '@/app/admin/encuentros/(actions)/fetch-tournaments-for-match.action';
import type { TEAM_TYPE } from '@/app/admin/encuentros/(actions)/fetch-teams-for-match-create.action';
import type { CATEGORY_TYPE } from '@/app/admin/encuentros/(actions)/fetch-categories-for-match.action';
import { FormFields } from '../(components)/form-fields';
import { useCreateMatch } from '../crear/use-create-match';

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  tournaments: TOURNAMENT_TYPE[];
  categories: CATEGORY_TYPE[];
  teams: TEAM_TYPE[];
}>;

export const CreateMatchForm: FC<Props> = ({
  tournaments,
  categories,
  teams,
  authenticatedUserId,
  authenticatedUserRoles,
}) => {
  const { form, onSubmit, handleNavigateBack } = useCreateMatch({
    authenticatedUserId,
    authenticatedUserRoles,
  });

  return (
    <section className="mt-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <FormFields
            tournaments={tournaments}
            categories={categories}
            teams={teams}
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
          </section>
        </form>
      </Form>
    </section>
  );
};
