import { Suspense, type FC } from 'react';
import { FormWeekSelector } from './formWeekSelector';

type Props = Readonly<{
  sortWeekPromise: Promise<{
    'sort-week'?: string;
  }>;
}>;

export const WeekSelector: FC<Props> = async ({ sortWeekPromise }) => {
  const sortWeek = (await sortWeekPromise)['sort-week'];

  return (
    <Suspense>
      <FormWeekSelector key={sortWeek ?? 'sort-week'} />
    </Suspense>
  );
};
