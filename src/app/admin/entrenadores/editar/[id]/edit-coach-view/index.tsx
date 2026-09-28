import type { FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { fetchCoachAction } from '../../../(actions)';
import { EditCoachForm } from '../edit-coach-form';
import type { Coach } from '@/shared/interfaces';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditCoachPageView: FC<Props> = async ({ params }) => {
  const coachId = (await params).id;
  const response = await fetchCoachAction(coachId);

  if (!response.ok) {
    redirect(`/admin/entrenadores?error=${encodeURIComponent(response.message)}`);
  }

  const coach = response.coach as Coach;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">
              Editar Entrenador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EditCoachForm coach={coach} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
