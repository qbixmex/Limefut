import type { FC } from 'react';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MatchView } from './match-view';
import { MatchViewSkeleton } from './match-view-skeleton';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const MatchPage: FC<Props> = async ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader>
            <CardTitle className="admin-page-card-title">Información del Encuentro</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<MatchViewSkeleton />}>
              <MatchView params={params} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MatchPage;
