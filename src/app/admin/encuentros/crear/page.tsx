import { type FC, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MatchContent } from './create-match-content';
import { FormSkeleton } from '../(components)/form-skeleton';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
    'sort-week'?: string;
  }>;
}>;

const CreateMatchPage: FC<Props> = ({ searchParams }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Encuentro</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<FormSkeleton />}>
              <MatchContent searchParams={searchParams} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateMatchPage;
