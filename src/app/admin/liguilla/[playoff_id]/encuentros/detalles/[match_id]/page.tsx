import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { PlayoffMatchContent } from './playoff-match-content';
import { EditMatch } from '../../(components)/edit-match';

type Props = Readonly<{
  params: Promise<{
    match_id: string;
    playoff_id: string;
  }>;
}>;

export const PlayoffMatchDetailsPage: FC<Props> = async ({ params }) => {
  const playoffId = (await params).playoff_id;
  const matchId = (await params).match_id;

  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Encuentro</CardTitle>
              <EditMatch playoffId={playoffId} matchId={matchId} />
            </CardHeader>
            <CardContent>
              <PlayoffMatchContent params={params} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlayoffMatchDetailsPage;
