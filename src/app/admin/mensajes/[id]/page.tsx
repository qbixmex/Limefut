import type { FC } from 'react';
import { Suspense } from 'react';
import { ContactMessageView } from './contact-message-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const MessagePage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Detalles del Mensaje</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactMessageView params={params} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Suspense>
  );
};

export default MessagePage;
