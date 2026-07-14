import type { FC, ReactNode } from 'react';
import { Suspense } from 'react';
import { CitiesField } from './cities-field';
import { CountryField } from './country-field';
import { ImageField } from './image-field';
import { NamePermalinkFields } from './name-permalink-fields';
import { FieldSkeleton } from '../field-skeleton';
import { SeasonField } from './season-field';
import { DescriptionTextArea } from './description-textarea';
import { InitialDateSelectField } from './initial-date-select-field';
import { EndDateSelectField } from './end-date-select-field';
import { ActiveSwitch } from './active-switch';

type Props = Readonly<{ categorySlot: ReactNode }>;

export const FormFields: FC<Props> = ({ categorySlot }) => {
  return (
    <>
      <NamePermalinkFields />

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <CountryField />
        </div>
        <div className="w-full lg:w-1/2">
          <CitiesField />
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <ImageField />
        </div>
        <div className="w-full lg:w-1/2">
          <Suspense fallback={<FieldSkeleton />}>
            {categorySlot}
          </Suspense>
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <SeasonField />
        </div>
        <div className="w-full lg:w-1/2">
          <DescriptionTextArea />
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2 flex flex-col md:flex-row items-center gap-5">
          <div className="w-full md:w-1/2">
            <InitialDateSelectField />
          </div>
          <div className="w-full md:w-1/2">
            <EndDateSelectField />
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex items-end justify-end">
          <div className="flex items-center gap-5">
            <ActiveSwitch />
          </div>
        </div>
      </div>
    </>
  );
};
