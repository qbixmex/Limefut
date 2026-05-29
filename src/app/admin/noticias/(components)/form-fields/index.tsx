'use client';

import type { FC } from 'react';
import { TitlePermalinkFields } from './title-permalink.fields';
import { PublishedDateField } from './published-date.field';
import { DescriptionField } from './description.field';
import { ContentField } from './content.field';
import { ActiveField } from './active.field';

export const FormFields: FC = () => {
  return (
    <>
      <TitlePermalinkFields />

      <section className="flex gap-5">
        <div className="flex-1">
          <PublishedDateField />
        </div>
        <div className="flex-1">
          <DescriptionField />
        </div>
      </section>

      <section>
        <ContentField />
      </section>

      <section className="flex flex-col gap-5 lg:flex-row mb-10">
        <div className="flex-1">
          {/* EMPTY FOR UI */}
        </div>
        <div className="w-full flex items-end lg:justify-end gap-5">
          <ActiveField />
        </div>
      </section>
    </>
  );
};
