import { Suspense, type FC } from 'react';
import { FormWeekSelector } from './formWeekSelector';

type Props = Readonly<{
  sortWeekPromise: Promise<{
    sortWeek?: string;
  }>;
}>;

export const WeekSelector: FC<Props> = async ({ sortWeekPromise }) => {
  const { sortWeek } = await sortWeekPromise;

  return (
    <Suspense>
      <FormWeekSelector key={sortWeek ?? 'week'} />
    </Suspense>
  );
};
