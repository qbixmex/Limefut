import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { PlayoffMatchView } from './playoff-match-view';
import { PlayoffMatchSkeleton } from './playoff-match-skeleton';
import { EditMatchSlot } from './edit-match-slot';

type Props = Readonly<{
  params: Promise<{
    match_id: string;
    playoff_id: string;
  }>;
}>;

export const PlayoffMatchDetailsPage = ({ params }: Props) => {
  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Encuentro</CardTitle>
              <Suspense>
                <EditMatchSlot params={params} />
              </Suspense>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<PlayoffMatchSkeleton />}>
                <PlayoffMatchView params={params} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlayoffMatchDetailsPage;
