import { randomUUID } from 'node:crypto';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// import { TournamentForm } from '../(components)/categoryForm';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import type { Session } from '@/lib/auth-client';
import { Suspense } from 'react';
import { ROUTES } from '@/shared/constants/routes';
import { CategoryForm } from '../(components)/category-form';

const CreateCategoryPage = async () => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Categoría</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <Suspense>
              <CreateCategoryContent />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CreateCategoryContent = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && !(session.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear categorías !';
    redirect(`${ROUTES.ADMIN_CATEGORIES}?error=${encodeURIComponent(message)}`);
  }

  return (
    <CategoryForm
      key={randomUUID()}
      session={session as Session}
    />
  );
};

export default CreateCategoryPage;
