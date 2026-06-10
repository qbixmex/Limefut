import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { EditPlayoffMatchContent } from './edit-playoff-match-content';

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
              <EditPlayoffMatchContent params={params} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EditPlayoffMatchPage;
