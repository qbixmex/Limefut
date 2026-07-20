import type { FC } from 'react';
import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EditCategoryView } from './edit-category-view';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditCategoryPage: FC<Props> = ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle
              className="admin-page-card-title"
              role="heading"
              aria-label="Título de la página"
            >
              Editar Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <EditCategoryView params={params} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditCategoryPage;
