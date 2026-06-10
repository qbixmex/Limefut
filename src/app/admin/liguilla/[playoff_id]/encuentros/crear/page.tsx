import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatePlayoffMatchContent } from './create-playoff-match-content';

type Props = Readonly<{
  params: Promise<{
    playoff_id: string;
  }>;
}>;

export const CreatePlayoffMatchPage: FC<Props> = ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Encuentro</CardTitle>
          </CardHeader>
          <CardContent>
            <CreatePlayoffMatchContent params={params} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePlayoffMatchPage;
