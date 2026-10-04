'use client';

import type { FC } from 'react';
import { ActiveField } from './active-field';
import { ImageField } from './image-field';
import { PositionField } from './position-field';
import { TitleField } from './title-field';

export const GalleryImageFormFields: FC = () => {
  return (
    <div className="flex flex-col gap-5 mb-5">
      <TitleField />
      <ImageField />

      <div className="grid grid-cols-2 gap-5">
        <PositionField />
        <div className="flex justify-end">
          <ActiveField />
        </div>
      </div>
    </div>
  );
};
