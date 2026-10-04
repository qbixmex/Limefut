'use client';

import { useState, type FC } from 'react';
import { ActiveField } from './active-field';
import { GalleryDateField } from './gallery-date-field';
import { PermalinkField } from './permalink-field';
import { TitleField } from './title-field';

export const FormFields: FC = () => {
  const [isPermalinkEdited, setPermalinkEdited] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TitleField isPermalinkEdited={isPermalinkEdited} />
        </div>

        <div className="w-full lg:w-1/2">
          <PermalinkField setPermalinkEdited={setPermalinkEdited} />
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
        <div className="w-full lg:w-1/2">
          <GalleryDateField />
        </div>

        <div className="w-full lg:w-1/2">
          <ActiveField />
        </div>
      </div>
    </>
  );
};
