import crypto from 'node:crypto';
import { Suspense, type FC } from 'react';
import { headers } from 'next/headers';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// import { FieldForm } from '../(components)/fieldForm';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { Field } from '@/shared/interfaces';
import type { Session } from '@/lib/auth-client';
import { FieldForm } from '../(components)/fieldForm';

const CreateFieldPage = () => {
  return (
    <Suspense>
      <CreateFieldContent />
    </Suspense>
  );
};

const CreateFieldContent: FC = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && !(session.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear canchas !';
    redirect(`/admin/equipos?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldForm
              key={crypto.randomUUID()}
              session={session as Session}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateFieldPage;
