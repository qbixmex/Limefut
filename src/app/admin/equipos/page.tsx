import { type FC, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamsContent } from './(components)/teams-content';
import { ClearFilters } from './(components)/clear-filters';
import { TournamentsSelectorSkeleton } from './(components)/TournamentsSelectorSkeleton';
import { Search } from '@/shared/components/search';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { CreateTeam } from './(components)/create-team';
import { SearchParamsSelectors } from './(components)/search-params-selectors';

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
    query?: string;
    page?: string;
  }>;
}>;

const TeamsPage: FC<Props> = ({ searchParams }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Lista de Equipos</CardTitle>
            <section className="flex gap-5 items-center">
              <ClearFilters />
              <Search placeholder="Buscar equipo ..." />
              <CreateTeam />
            </section>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<TournamentsSelectorSkeleton />}>
              <SearchParamsSelectors />
            </Suspense>
            <Suspense>
              <ErrorHandler />
              <TeamsContent searchParamsPromise={searchParams} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamsPage;
