import type { FC } from 'react';
import { Suspense } from 'react';
import { CoachesPageView } from './coaches-view';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const CoachesPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense>
      <CoachesPageView searchParams={searchParams} />
    </Suspense>
  );
};

export default CoachesPage;
