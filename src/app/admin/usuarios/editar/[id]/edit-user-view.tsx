import type { FC } from 'react';
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

export const EditUserView: FC<Props> = async ({ params }) => {
  const userId = (await params).id;
  const response = await fetchUserAction(userId);

  if (!response.ok && response.message) {
    redirect(`${ROUTES.ADMIN_USERS}?error=${encodeURIComponent(response.message)}`);
  }

  return (
    <UsersForm user={response.user as User} />
  );
};
