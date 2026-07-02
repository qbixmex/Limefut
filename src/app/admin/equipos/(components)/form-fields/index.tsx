import { Suspense, type FC, type ReactNode } from 'react';
import { NameAndPermalinkFields } from './name-and-permalink-fields';
import { FieldSkeleton } from '../field-skeleton';
import { FormatSelectField } from './format-select-field';
import { ImageField } from './image-field';
import { GenderSelect } from './gender-select';
import { CountryField } from './country-field';
import { StateField } from './state-field';
import { CityField } from './city-field';
import { EmailsField } from './emails-field';
import { AddressTextArea } from './address-text-area';
import { ActiveSwitch } from './active-switch';

type Props = Readonly<{
  tournamentSlot: ReactNode;
  categorySlot: ReactNode;
  coachesSlot: ReactNode;
  fieldsSlot: ReactNode;
}>;

export const FormFields: FC<Props> = ({
  tournamentSlot,
  categorySlot,
  coachesSlot,
  fieldsSlot,
}) => {
  return (
    <>
      <NameAndPermalinkFields />

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <Suspense fallback={<FieldSkeleton />}>
            {categorySlot}
          </Suspense>
        </div>
        <div className="w-full lg:w-1/2">
          <FormatSelectField />
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <ImageField />
        </div>
        <div className="w-full lg:w-1/2">
          <GenderSelect />
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <Suspense fallback={<FieldSkeleton />}>
            {tournamentSlot}
          </Suspense>
        </div>
        <div className="w-full lg:w-1/2">
          <CountryField />
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <StateField />
        </div>
        <div className="w-full lg:w-1/2">
          <CityField />
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <Suspense fallback={<FieldSkeleton />}>
            {coachesSlot}
          </Suspense>
        </div>
        <div className="w-full lg:w-1/2">
          <EmailsField />
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <Suspense fallback={<FieldSkeleton />}>
            {fieldsSlot}
          </Suspense>
        </div>
        <div className="w-full lg:w-1/2">
          <AddressTextArea />
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          {/* empty for ui */}
        </div>
        <div className="w-full lg:w-1/2">
          <ActiveSwitch />
        </div>
      </div>
    </>
  );
};
