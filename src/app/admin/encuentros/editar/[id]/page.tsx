import type { FC } from 'react';
import { Suspense } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditMatchView } from './edit-match-view';
import { FormSkeleton } from '../../(components)/form-skeleton';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    tournament?: string;
    category?: string;
  }>;
}>;

export const EditMatchPage: FC<Props> = ({ params, searchParams }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">
              Editar Encuentro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<FormSkeleton />}>
              <EditMatchView
                params={params}
                searchParams={searchParams}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditMatchPage;
