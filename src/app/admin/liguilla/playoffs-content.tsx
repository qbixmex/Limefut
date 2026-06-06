import type { FC } from 'react';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { fetchPlayoffsAction } from './(actions)/fetch-playoffs.action';
import { PlayoffsTable } from './playoffs-table';

type Props = Readonly<{
  searchParams: Promise<{
    page?: string;
    query?: string;
  }>;
}>;

export const PlayoffsContent: FC<Props> = async ({ searchParams }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const { query, page } = await searchParams;
  const currentPage = parseInt(page ?? '1') ?? 1;

  const { ok, message, playoffs, pagination } = await fetchPlayoffsAction({
    authenticatedUserId: session?.user.id,
    authenticatedUserRoles: session?.user.roles,
    page: currentPage,
    query,
  });

  if (!ok) {
    redirect(`${ROUTES.ADMIN_PLAYOFFS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <section className="mt-10">
      <Suspense
        // TODO: fallback={<MatchesTableSkeleton />}
        fallback={<p>Cargando partidos</p>}
      >
        <PlayoffsTable
          playoffs={playoffs}
          pagination={pagination}
          authenticatedUserId={session?.user.id}
          authenticatedUserRoles={session?.user.roles}
        />
      </Suspense>
    </section>
  );
};
