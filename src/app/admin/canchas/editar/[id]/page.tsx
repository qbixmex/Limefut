import { Suspense, type FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { Session } from '@/lib/auth-client';
import { fetchFieldAction } from '../../(actions)';
import { FieldForm } from '../../(components)/fieldForm';
import { headers } from 'next/headers';
import { ROUTES } from '@/shared/constants/routes';
import type { Field } from '@/shared/interfaces';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditFieldPage: FC<Props> = async ({ params }) => {
  return (
    <Suspense>
      <EditFieldPageContent params={params} />
    </Suspense>
  );
};

const EditFieldPageContent: FC<Props> = async ({ params }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const teamId = (await params).id;
  const { ok, message, field } = await fetchFieldAction(teamId, session?.user.roles ?? null);

  if (!ok) {
    redirect(`${ROUTES.ADMIN_FIELDS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Cancha</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldForm
              key={teamId}
              session={session as Session}
              field={field as Field}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditFieldPage;
