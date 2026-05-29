'use client';

import type { FC } from 'react';
import { TitlePermalinkFields } from './title-permalink.fields';
import { PublishedDateField } from './published-date.field';
import { DescriptionField } from './description.field';
import { ContentField } from './content.field';
import { ImageField } from './image.field';
import { ActiveField } from './active.field';

type Props = Readonly<{ imageUrl?: string | null; }>;

export const FormFields: FC<Props> = ({ imageUrl }) => {
  return (
    <>
      <TitlePermalinkFields />

      <section className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1">
          <PublishedDateField />
        </div>
        <div className="flex-1">
          <DescriptionField />
        </div>
      </section>

      <section className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1">
          <ImageField imageUrl={imageUrl} />
        </div>
        <div className="flex-1">
          <ContentField />
        </div>
      </section>

      <section className="flex flex-col gap-5 lg:flex-row mb-10">
        <div className="flex-1">
          {/* EMPTY FOR UI */}
        </div>
        <div className="w-full flex justify-end">
          <ActiveField />
        </div>
      </section>
    </>
  );
};
