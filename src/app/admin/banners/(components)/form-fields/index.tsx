import type { FC } from 'react';
import { ActiveField } from './active-field';
import { AlignmentField } from './alignment-field';
import { DescriptionField } from './description-field';
import { ImageField } from './image-field';
import { PositionField } from './position-field';
import { ShowDataField } from './show-data-field';
import { TitleField } from './title-field';

type Props = Readonly<{
  showMetaFields?: boolean;
}>;

export const FormFields: FC<Props> = ({ showMetaFields = false }) => {
  return (
    <>
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2 flex flex-col gap-5">
          <TitleField />
          <ImageField />
        </div>
        <div className="w-full lg:w-1/2">
          <DescriptionField />
        </div>
      </div>

      {showMetaFields && (
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2">
            <PositionField />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="h-full flex items-end justify-end">
              <ActiveField />
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl text-blue-500 font-semibold mb-3">
        Alineación y visibilidad de información
      </h2>

      <div className="w-full flex flex-col lg:flex-row items-end gap-10">
        <div className="w-full lg:w-1/2 flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-10">
          <div className="flex-1"><AlignmentField /></div>
          <div className="flex-1"><ShowDataField /></div>
        </div>
      </div>
    </>
  );
};
