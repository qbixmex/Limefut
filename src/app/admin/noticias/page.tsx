import { Suspense, type FC } from 'react';
import { NewsContent } from './(components)/news-content';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const SponsorsPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense>
      <NewsContent searchParams={searchParams} />
    </Suspense>
  );
};

export default SponsorsPage;
