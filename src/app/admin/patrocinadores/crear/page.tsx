import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SponsorForm } from '../(components)/sponsor-form';
import type { Session } from '@/lib/auth-client';
import { auth } from '@/lib/auth';

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
  }>;
}>;

const CreateSponsorPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense>
      <CreateSponsorContent searchParams={searchParams} />
    </Suspense>
  );
};

const CreateSponsorContent: FC<Props> = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Patrocinador</CardTitle>
          </CardHeader>
          <CardContent>
            <SponsorForm
              key={randomUUID()}
              session={session as Session}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateSponsorPage;
