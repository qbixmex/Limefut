import { useState, type FC } from 'react';
import { PermalinkField } from '../permalink-field';
import { NameField } from '../name-field';

export const NameAndPermalinkFields: FC = () => {
  const [isPermalinkEdited, setIsPermalinkEdited] = useState(false);

  return (
    <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <NameField isPermalinkEdited={isPermalinkEdited} />
        </div>

        <div className="w-full lg:w-1/2">
            <PermalinkField setPermalinkEdited={setIsPermalinkEdited} />
        </div>
      </div>
  );
};
