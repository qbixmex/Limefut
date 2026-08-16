import type { FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UsersForm } from '../../(components)/usersForm';
import { fetchUserAction } from '../../(actions)/fetchUserAction';
import { redirect } from 'next/navigation';
import type { User } from '@/shared/interfaces';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditUser: FC<Props> = async ({ params }) => {
  const userId = (await params).id;
  const response = await fetchUserAction(userId);

  if (!response.ok) {
    redirect(`${ROUTES.ADMIN_USERS}?error=${encodeURIComponent(response.message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersForm
              user={response.user as User}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditUser;
