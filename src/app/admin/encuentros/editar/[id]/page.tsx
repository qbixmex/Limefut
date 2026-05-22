import { Suspense, type FC } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FormSkeleton from '../../(components)/form-skeleton';
import { EditMatchContent } from './edit-match-content';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditMatchPage: FC<Props> = ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Encuentro</CardTitle>
          </CardHeader>
          <CardContent>
            <EditMatchWrapper params={params} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const EditMatchWrapper: FC<Props> = async ({ params }) => {
  const matchId = (await params).id;

  return (
    <Suspense fallback={<FormSkeleton />}>
      <EditMatchContent matchId={matchId} />
    </Suspense>
  );
};

export default EditMatchPage;
