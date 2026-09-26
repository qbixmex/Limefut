'use client';

import { NameField } from './name-field';
import { UserNameField } from './user-name-field';

export const NameUsernameFields = () => {
  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      <div className="w-full lg:w-1/2">
        <NameField />
      </div>
      <div className="w-full lg:w-1/2">
        <UserNameField />
      </div>
    </div>
  );
};
