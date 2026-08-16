import { Suspense, type FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { fetchFieldAction } from '../../(actions)';
import { FieldForm } from '../../(components)/fieldForm';
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
  const teamId = (await params).id;
  const { ok, message, field } = await fetchFieldAction(teamId);

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
              field={field as Field}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditFieldPage;
