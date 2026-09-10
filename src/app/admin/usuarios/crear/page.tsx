import { Suspense } from 'react';
import { CreateUserView } from './create-user-view';

const CreateUserPage = () => {
  return (
    <Suspense>
      <CreateUserView />
    </Suspense>
  );
};

export default CreateUserPage;
