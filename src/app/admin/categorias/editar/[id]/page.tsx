import type { FC } from 'react';
import { Suspense } from 'react';
import { randomUUID } from 'node:crypto';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@/lib/auth';
import type { Session } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import type { Category } from '@/shared/interfaces';
import { headers } from 'next/headers';
import { fetchCategoryAction } from '../../(actions)/fetch-category.action';
import { CategoryForm } from '../../(components)/category-form';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditTournamentPage: FC<Props> = ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <EditCategoryContent params={params} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const EditCategoryContent: FC<Props> = async ({ params }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const categoryId = (await params).id;
  const { ok, message, category } = await fetchCategoryAction(categoryId, session?.user.roles ?? null);

  if (!ok && !category) {
    redirect(`${ROUTES.ADMIN_CATEGORIES}?error=${encodeURIComponent(message)}`);
  }

  return (
    <CategoryForm
      key={randomUUID()}
      session={session as Session}
      category={category as Category}
    />
  );
};

export default EditTournamentPage;
