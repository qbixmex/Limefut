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

      <h2 className="font-semibold mb-2">Información:</h2>

      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col lg:flex-row items-center gap-5">
            <div className="w-full lg:w-1/2">
              <AlignmentField />
            </div>
            <div className="w-full lg:w-1/2">
              <ShowDataField />
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          {showMetaFields && (
            <div className="flex gap-5 justify-end">
              <PositionField />
              <ActiveField />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
