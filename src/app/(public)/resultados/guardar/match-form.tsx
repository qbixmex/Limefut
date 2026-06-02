'use client';

import type { FC, ReactNode } from 'react';
import { Suspense } from 'react';
import { useMatchForm } from './use-match-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { LocalVisitorGoals } from './local-visitor-goals';
import { DateTime } from './date-time';
import { RefereeField } from './referee-field';
import { PenaltiesShoots } from './penalties-shoots';
import { Remarks } from './remarks';
import { FieldSkeleton } from './field-skeleton';
import { FieldsSkeleton } from './fields-skeleton';
import styles from './styles.module.css';

type Props = Readonly<{
  categorySlot: ReactNode;
  fieldSlot: ReactNode;
  teamsSlot: ReactNode;
}>;

export const MatchForm: FC<Props> = ({ categorySlot, fieldSlot, teamsSlot }) => {
  const { form, onSubmit, handleClearForm } = useMatchForm();

  return (
    <section className="w-full lg:max-w-md lg:mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Suspense fallback={<FieldSkeleton />}>
            {categorySlot}
          </Suspense>
          <Suspense fallback={<FieldsSkeleton />}>
            {teamsSlot}
          </Suspense>
          <LocalVisitorGoals />
          <PenaltiesShoots />
          <section className={styles.fieldsGroup}>
            <Suspense fallback={<FieldSkeleton />}>
              {fieldSlot}
            </Suspense>
          </section>
          <section className={styles.fieldsGroup}>
            <DateTime />
            <RefereeField />
          </section>
          <Remarks />
          <section className={styles.buttonsGroup}>
            <Button
              type="button"
              variant="outline-primary"
              onClick={handleClearForm}
            >borrar</Button>
            <Button
              type="submit"
              variant="outline-primary"
            >guardar</Button>
          </section>
        </form>
      </Form>
    </section>
  );
};
