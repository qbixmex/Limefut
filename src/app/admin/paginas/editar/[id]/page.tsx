import type { FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { fetchPageAction, type PageType } from '../../(actions)/fetchPageAction';
import { PageForm } from '../../(components)/page-form';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditCustomPage: FC<Props> = async ({ params }) => {
  const pageId = (await params).id;

  const response = await fetchPageAction(pageId);

  if (!response.page) {
    const message = `¡ La página con el id: "${pageId}", no existe ❌ !`;
    redirect(`/admin/paginas?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Página</CardTitle>
          </CardHeader>
          <CardContent>
            <PageForm
              key={response.page.id}
              page={response.page as PageType}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditCustomPage;
