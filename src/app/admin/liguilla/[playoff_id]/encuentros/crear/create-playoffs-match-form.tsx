'use client';

import type { FC, ReactNode } from 'react';
import { Suspense } from 'react';
import { Form } from '@/components/ui/form';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreatePlayoffsMatch } from './use-create-playoffs-match';
import { LocalAndVisitorGoals } from '../(components)/form-fields/local-and-visitor-goals';
import { RefereeInputField } from '../(components)/form-fields/referee-input-field';
import { RemarksTextAreaField } from '../(components)/form-fields/remarks-textarea-field';
import { MatchDateTime } from '../(components)/form-fields/match-date-time';
import { GroupRadioSelect } from '../(components)/form-fields/group-radio-select';
import { MatchStatusSelectField } from '../(components)/form-fields/match-status-select-field';
import { FieldSkeleton } from '@/app/admin/liguilla/(components)/field-skeleton';
import { FieldsSkeleton } from '@/app/admin/liguilla/(components)/fields-skeleton';
import { RoundSelectField } from '../(components)/form-fields/round-select-field';

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  playoffId: string;
  teamsSlot: ReactNode;
  fieldsSlot: ReactNode;
}>;

export const CreatePlayoffsMatchForm: FC<Props> = ({
  authenticatedUserId,
  authenticatedUserRoles,
  playoffId,
  teamsSlot,
  fieldsSlot,
}) => {
  const { form, onSubmit, handleNavigateBack } = useCreatePlayoffsMatch({
    authenticatedUserId,
    authenticatedUserRoles,
    playoffId,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-full flex flex-col gap-5">
          <Suspense fallback={<FieldsSkeleton />}>
            {teamsSlot}
          </Suspense>

          <LocalAndVisitorGoals />

          <section className="flex flex-col lg:flex-row gap-5">
            <div className="w-full lg:w-1/2 flex flex-col gap-5">
              <RefereeInputField />
              <Suspense fallback={<FieldSkeleton />}>
                {fieldsSlot}
              </Suspense>
            </div>
            <div className="w-full lg:w-1/2">
              <RemarksTextAreaField />
            </div>
          </section>

          <section className="flex flex-col lg:flex-row gap-5">
            <div className="w-full lg:w-1/2">
              <MatchDateTime />
            </div>
            <div className="w-full lg:w-1/2">
              <div className="flex flex-col lg:flex-row gap-5">
                <div className="w-full lg:w-1/3"><GroupRadioSelect /></div>
                <div className="w-full lg:w-1/3"><RoundSelectField /></div>
                <div className="w-full lg:w-1/3"><MatchStatusSelectField /></div>
              </div>
            </div>
          </section>

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
        </div>
      </form>
    </Form>
  );
};
