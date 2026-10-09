'use client';

import { useState, type FC } from 'react';
import { TitleField } from '../title-field';
import { PermalinkField } from '../permalink-field';

type Props = Readonly<{
  name?: string;
}>;

export const TitlePermalinkField: FC<Props> = () => {
  const [isPermalinkEdited, setPermalinkEdited] = useState(false);

  return (
    <>
      <div className="w-full lg:w-1/2">
        <TitleField isPermalinkEdited={isPermalinkEdited} />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-5">
        <PermalinkField setPermalinkEdited={setPermalinkEdited} />
      </div>
    </>
  );
};
