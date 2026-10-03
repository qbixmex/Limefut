import type { FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlayOffDetailsView } from './playoff-details-view';

type Props = Readonly<{
  params: Promise<{
    playoff_id: string;
  }>;
}>;

export const PlayoffPage: FC<Props> = ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <div className="w-full flex justify-between">
              <CardTitle className="admin-page-card-title">Detalles de la Liguilla</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <PlayOffDetailsView params={params} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayoffPage;
