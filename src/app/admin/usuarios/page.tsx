import type { FC } from 'react';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Search } from '@/shared/components/search';
import { UsersTable } from './(components)/users-table';
import { UsersTableSkeleton } from './(components)/users-table-skeleton';
import { CreateUser } from './(components)/create-user';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const UsersPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense>
      <UsersContent searchParams={searchParams} />
    </Suspense>
  );
};

const UsersContent: FC<Props> = async ({ searchParams }) => {
  const query = (await searchParams).query || '';
  const currentPage = (await searchParams).page ?? '1';

  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Usuarios</CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar usuario ..." />
                <CreateUser />
              </section>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <Suspense
                key={`${query}-${currentPage}`}
                fallback={<UsersTableSkeleton colCount={7} rowCount={6} />}
              >
                <UsersTable
                  query={query}
                  currentPage={currentPage}
                />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UsersPage;
