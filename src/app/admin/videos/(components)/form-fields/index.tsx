'use client';

import { DescriptionTextArea } from './description-text-area';
import { PermalinkField } from './permalink-field';
import { PlatformSelectField } from './platform-select-field';
import { PublishedDateField } from './published-date-field';
import { TitleField } from './title-field';
import { ActiveVideoSwitch } from './active-video-switch';
import { UrlField } from './url-field';

export const FormFields = () => {
  return (
    <>
      <section className="flex flex-col gap-5 lg:flex-row">
        <div className="flex-1">
          <TitleField />
        </div>
        <div className="flex-1">
          <PermalinkField />
        </div>
      </section>

      <section className="flex flex-col gap-5 lg:flex-row">
        <div className="flex-1">
          <UrlField />
        </div>
        <div className="flex-1">
          <DescriptionTextArea />
        </div>
      </section>

      <section className="flex flex-col gap-5 lg:flex-row mb-10">
        <div className="w-full flex gap-5">
          <div className="w-1/2">
            <PlatformSelectField />
          </div>
          <div className="w-1/2">
            <PublishedDateField />
          </div>
        </div>
        <div className="w-full flex items-end lg:justify-end gap-5">
          <ActiveVideoSwitch />
        </div>
      </section>
    </>
  );
};
