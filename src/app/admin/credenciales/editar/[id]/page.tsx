import type { FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { fetchCredentialAction, fetchPlayersForCredentialForm } from '../../(actions)';
import { CredentialForm } from '../../(components)/CredentialForm';
import { type Credential } from '@/shared/interfaces';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditCredential: FC<Props> = async ({ params }) => {
  const id = (await params).id;
  const responseCredentialAction = await fetchCredentialAction(id);

  if (!responseCredentialAction.ok) {
    redirect(`/admin/credenciales?error=${encodeURIComponent(responseCredentialAction.message)}`);
  }

  const responsePlayersResponse = await fetchPlayersForCredentialForm();

  if (!responsePlayersResponse.ok) {
    redirect(`/admin/credenciales?error=${encodeURIComponent(responsePlayersResponse.message)}`);
  }

  const credential = responseCredentialAction.credential;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Credencial</CardTitle>
          </CardHeader>
          <CardContent>
            <CredentialForm credential={credential as Credential} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditCredential;
