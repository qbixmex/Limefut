import type { FC } from 'react';
import { UserPasswordConfirmationField } from './user-password-confirmation-field';
import { UserPasswordField } from './user-password-field';

type Props = Readonly<{ edit?: boolean }>;

export const UserPasswordsFields: FC<Props> = ({ edit }) => {
  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      <div className="w-full lg:w-1/2">
        <UserPasswordField edit={edit} />
      </div>
      <div className="w-full lg:w-1/2">
        <UserPasswordConfirmationField edit={edit} />
      </div>
    </div>
  );
};
