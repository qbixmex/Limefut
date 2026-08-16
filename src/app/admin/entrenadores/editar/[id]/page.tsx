import { Suspense, type FC } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { fetchCoachAction } from '../../(actions)';
import { CoachForm } from '../../(components)/coachForm';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditCoachPage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <EditCoachPageContent params={params} />
    </Suspense>
  );
};

const EditCoachPageContent: FC<Props> = async ({ params }) => {
  const coachId = (await params).id;
  const response = await fetchCoachAction(coachId);

  if (!response.ok) {
    redirect(`/admin/entrenadores?error=${encodeURIComponent(response.message)}`);
  }

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
            <CoachForm
              coach={response.coach!}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditCoachPage;
