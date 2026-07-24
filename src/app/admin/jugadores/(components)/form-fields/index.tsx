import type { FC } from 'react';
import { NameField } from './name-field';
import { EmailField } from './email-field';
import { PhoneField } from './phone-field';
import { NationalityField } from './nationality-field';
import { BirthdayField } from './birthday-field';
import { ImageField } from './image-field';
import { TeamSelectField } from './team-select-field';
import { ActiveSwitch } from './active-switch';

type TeamType = {
  id: string;
  name: string;
};

type Props = Readonly<{
  teams: TeamType[];
}>;

export const FormFields: FC<Props> = ({ teams }) => {
  return (
    <>
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2"><NameField /></div>
        <div className="w-full lg:w-1/2"><EmailField /></div>
      </div>
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2"><PhoneField /></div>
        <div className="w-full lg:w-1/2"><NationalityField /></div>
      </div>
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2"><BirthdayField /></div>
        <div className="w-full lg:w-1/2"><ImageField /></div>
      </div>
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2"><TeamSelectField teams={teams} /></div>
        <div className="w-full lg:w-1/2 flex items-end justify-end">
          <ActiveSwitch />
        </div>
      </div>
    </>
  );
};
