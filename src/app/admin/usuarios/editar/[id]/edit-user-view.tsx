import type { FC } from 'react';
import { fetchUserAction } from '../../(actions)/fetchUserAction';
import { redirect } from 'next/navigation';
import type { User } from '@/shared/interfaces';
import { ROUTES } from '@/shared/constants/routes';
import { EditUserForm } from './edit-user-form';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditUserView: FC<Props> = async ({ params }) => {
  const userId = (await params).id;
  const response = await fetchUserAction(userId);

  if (!response.ok && response.message) {
    redirect(`${ROUTES.ADMIN_USERS}?error=${encodeURIComponent(response.message)}`);
  }

  const user = response.user as User;

  return (
    <EditUserForm user={user} />
  );
};
