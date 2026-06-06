'use client';

import type { FC, ReactNode } from 'react';
import { Suspense } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { useCreatePlayoffs } from './use-create-playoffs';
import { FieldSkeleton } from './field-skeleton';
import { StartingRoundField } from '../(components)/form-fields/starting-round-field';
import styles from '../(components)/form-fields/form-fields.module.css';

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  tournamentSlot: ReactNode;
  categorySlot: ReactNode;
  teamsSlot: ReactNode;
}>;

export const CreatePlayoffsForm: FC<Props> = ({
  authenticatedUserId,
  authenticatedUserRoles,
  tournamentSlot,
  categorySlot,
  teamsSlot,
}) => {
  const { form, onSubmit, handleNavigateBack } = useCreatePlayoffs({
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
          <section className={styles.fieldsGroup}>
            <div className={styles.field}>
              <Suspense fallback={<FieldSkeleton />}>
                {tournamentSlot}
              </Suspense>
            </div>
            <div className={styles.field}>
              <Suspense fallback={<FieldSkeleton />}>
                {categorySlot}
              </Suspense>
            </div>
          </section>

          <section className={styles.fieldsGroup}>
            <div className={styles.field}>
              <Suspense fallback={<FieldSkeleton />}>
                {teamsSlot}
              </Suspense>
            </div>
            <div className={styles.field}>
              <StartingRoundField />
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
        </form>
      </Form>
    </section>
  );
};
