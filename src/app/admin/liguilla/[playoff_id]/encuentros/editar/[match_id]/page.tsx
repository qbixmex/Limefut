import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { EditPlayoffMatchView } from './edit-playoff-match-view';

type Props = Readonly<{
  params: Promise<{
    playoff_id: string;
    match_id: string;
  }>;
}>;

export const EditPlayoffMatchPage: FC<Props> = ({ params }) => {
  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Editar Encuentro</CardTitle>
            </CardHeader>
            <CardContent>
              <EditPlayoffMatchView params={params} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EditPlayoffMatchPage;
