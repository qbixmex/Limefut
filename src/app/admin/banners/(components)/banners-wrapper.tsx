import type { FC } from 'react';
import { getSession } from '@/lib/get-session';
import { fetchHeroBannersAction } from '../(actions)';
import { BannersTable } from './banners-table';

type Props = Readonly<{
  currentPage: number;
  query: string;
}>;

export const BannersWrapper: FC<Props> = async ({
  currentPage,
  query,
}) => {
  const session = await getSession();

  const response = await fetchHeroBannersAction({
    page: currentPage,
    take: 12,
    searchTerm: query,
  });

  const heroBanners = response.heroBanners;
  const pagination = response.pagination ?? {
    currentPage: 1,
    totalPages: 1,
  };

  return (
    <BannersTable
      banners={heroBanners}
      pagination={pagination}
      roles={session?.user.roles as string[]}
    />
  );
};
