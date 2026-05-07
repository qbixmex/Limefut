import { type FC, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MatchWrapper } from './create-match-content';
import { TournamentsSelectorSkeleton } from '@/app/(public)/components';
import { SearchParamsSelectors } from '../../equipos/(components)/search-params-selectors';
import { WeekSelector } from '../(components)/week-selector';

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
    categoria?: string;
    sortWeek?: string;
  }>;
}>;

const CreateMatchPage: FC<Props> = ({ searchParams }) => {
  const sortWeekPromise = searchParams.then((sp) => ({ sortWeek: sp.sortWeek }));

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Encuentro</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<TournamentsSelectorSkeleton />}>
              <section className="flex flex-col md:flex-row gap-10">
                <div className="w-full lg:w-1/2">
                  <SearchParamsSelectors />
                </div>
                <div className="w-full lg:w-1/2">
                  <WeekSelector sortWeekPromise={sortWeekPromise} />
                </div>
              </section>
            </Suspense>
            <Suspense>
              <MatchWrapper searchParams={searchParams} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateMatchPage;
