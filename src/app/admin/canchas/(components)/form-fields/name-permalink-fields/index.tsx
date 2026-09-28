'use client';

import { useState, type FC } from 'react';
import { NameField } from '../name-field';
import { PermalinkField } from '../permalink-field';

export const NamePermalinkFields: FC = () => {
  const [isPermalinkEdited, setPermalinkEdited] = useState(false);

  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      <div className="w-full lg:w-1/2">
        <NameField isPermalinkEdited={isPermalinkEdited} />
      </div>

      <div className="w-full lg:w-1/2">
        <PermalinkField setPermalinkEdited={setPermalinkEdited} />
      </div>
    </div>
  );
};
