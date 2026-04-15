import { type FC, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// TODO: import { FieldsContent } from './(components)/fields-content';
import { Search } from '@/shared/components/search';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { FieldsContent } from './(components)/fields-content';
import { CreateField } from './(components)/create-field';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const CanchasPage: FC<Props> = ({ searchParams }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Canchas</CardTitle>
            <section className="flex gap-5 items-center">
              <Search placeholder="Buscar cancha" />
              <CreateField />
            </section>
          </CardHeader>
          <CardContent>
            <Suspense>
              <ErrorHandler />
              <FieldsContent searchParamsPromise={searchParams} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CanchasPage;
