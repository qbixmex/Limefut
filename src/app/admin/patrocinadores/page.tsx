import { Suspense, type FC } from 'react';
import { CustomSponsorsContent } from './(components)/sponsors-content';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const SponsorsPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense>
      <CustomSponsorsContent searchParams={searchParams} />
    </Suspense>
  );
};

export default SponsorsPage;
