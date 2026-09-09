import { Suspense, type FC } from 'react';
import { UserProfileView } from './user-profile-view';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const UserProfilePage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <UserProfileView params={params} />
    </Suspense>
  );
};

export default UserProfilePage;
