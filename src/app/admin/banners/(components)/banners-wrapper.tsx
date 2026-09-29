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

  const { heroBanners, pagination } = await fetchHeroBannersAction({
    page: currentPage,
    take: 12,
    searchTerm: query,
  });

  return (
    <BannersTable
      banners={heroBanners ?? []}
      pagination={pagination ?? { currentPage: 1, totalPages: 1 }}
      roles={session?.user.roles as string[]}
    />
  );
};
