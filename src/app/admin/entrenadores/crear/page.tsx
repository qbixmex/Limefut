import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CoachForm } from '../(components)/coachForm';
import type { Session } from '@/lib/auth-client';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

const CreateCoachPage = () => {
  return (
    <Suspense>
      <CreateCoachPageContent />
    </Suspense>
  );
};

const CreateCoachPageContent = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && !(session.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear entrenadores !';
    redirect(`/admin/entrenadores?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Entrenador</CardTitle>
          </CardHeader>
          <CardContent>
            <CoachForm session={session as Session} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCoachPage;
