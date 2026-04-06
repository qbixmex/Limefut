import { Suspense, type FC } from 'react';
import { VideosContent } from './(components)/videos-content';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const VideosPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense>
      <VideosContent searchParams={searchParams} />
    </Suspense>
  );
};

export default VideosPage;
