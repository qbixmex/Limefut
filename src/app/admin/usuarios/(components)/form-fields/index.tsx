'use client';

import type { FC } from 'react';
import { NameUsernameFields } from './name-username-fields';
import { EmailField } from './email-field';
import { ImageField } from './image-field';
import { UserPasswordsFields } from './user-passwords-fields';
import { RolesSelectField } from './roles-select-field';
import { UserActiveSwitch } from './user-active-switch';

export const FormFields: FC = () => {
  return (
    <>
      <NameUsernameFields />

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <EmailField />
        </div>
        <div className="w-full lg:w-1/2">
          <ImageField />
        </div>
      </div>

      <UserPasswordsFields edit />

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <RolesSelectField />
        </div>
        <div className="w-full lg:w-1/2">
          <UserActiveSwitch />
        </div>
      </div>
    </>
  );
};
