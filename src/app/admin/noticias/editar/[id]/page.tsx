import { Suspense, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditAnnouncementView } from './edit-announcement-view';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditAnnouncementPage: FC<Props> = ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle
              className="admin-page-card-title"
              role="heading"
              aria-level={1}
            >
              Editar Noticia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <EditAnnouncementView params={params} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditAnnouncementPage;
