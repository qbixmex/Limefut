import type { FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { fetchFieldAction } from '../../../(actions)';
import { EditFieldForm } from '../edit-field-form';
import { ROUTES } from '@/shared/constants/routes';
import type { Field } from '@/shared/interfaces';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditFieldPageView: FC<Props> = async ({ params }) => {
  const fieldId = (await params).id;

  const { ok, message, field } = await fetchFieldAction(fieldId);

  if (!ok) {
    redirect(`${ROUTES.ADMIN_FIELDS}?error=${encodeURIComponent(message)}`);
  }

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
              Editar Cancha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EditFieldForm field={field as Field} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
