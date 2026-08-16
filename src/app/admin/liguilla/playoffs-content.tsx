import type { FC } from 'react';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { fetchPlayoffsAction } from './(actions)/fetch-playoffs.action';
import { PlayoffsTable } from './playoffs-table';

type Props = Readonly<{
  searchParams: Promise<{
    page?: string;
    query?: string;
  }>;
}>;

export const PlayoffsContent: FC<Props> = async ({ searchParams }) => {
  const { query, page } = await searchParams;
  const currentPage = parseInt(page ?? '1') ?? 1;

  const { ok, message, playoffs, pagination } = await fetchPlayoffsAction({
    page: currentPage,
    query,
  });

  if (!ok) {
    redirect(`${ROUTES.ADMIN_PLAYOFFS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <PlayoffsTable
      playoffs={playoffs}
      pagination={pagination}
    />
  );
};
