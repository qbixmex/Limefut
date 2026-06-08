import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Search } from '@/shared/components/search';
import { ClearFilters } from '../../encuentros/(components)/clear-filters';

type Props = Readonly<{
  params: Promise<{
    match_id: string;
    playoff_id: string;
  }>;
}>;

export const PlayoffMatchDetailsPage: FC<Props> = ({ params }) => {
  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Encuentro</CardTitle>
              <section className="flex gap-2.5">
                <Search placeholder="ejemplo: chivas vs atlas" />
                <ClearFilters />
              </section>
            </CardHeader>
            <CardContent>
              <MatchContent params={params} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

const MatchContent: FC<Props> = async ({ params }) => {
  const {
    playoff_id: playoffId,
    match_id: matchId,
  } = await params;

  return (
    <>
      <p className="text-2xl space-x-2">
        <span className="text-blue-600 font-semibold">Playoff ID:</span>
        <span className="text-gray-400">{ playoffId }</span>
      </p>
      <p className="text-2xl space-x-2">
        <span className="text-blue-600 font-semibold">Match ID:</span>
        <span className="text-gray-400">{ matchId }</span>
      </p>
    </>
  );
};

export default PlayoffMatchDetailsPage;
