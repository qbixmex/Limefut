import { Suspense, type FC } from 'react';
import { AnnouncementsContent } from './(components)/announcements-content';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const AnnouncementsPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense>
      <AnnouncementsContent searchParams={searchParams} />
    </Suspense>
  );
};

export default AnnouncementsPage;
