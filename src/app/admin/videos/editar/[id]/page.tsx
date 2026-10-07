import { Suspense, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditVideoView } from './edit-video-view';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditVideoPage: FC<Props> = ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Video</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <EditVideoView params={params} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditVideoPage;
