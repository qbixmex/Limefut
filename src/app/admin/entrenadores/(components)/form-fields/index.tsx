import { ActiveSwitch } from './active-switch';
import { AgeField } from './age-field';
import { DescriptionTextArea } from './description-text-area';
import { EmailField } from './email-field';
import { ImageField } from './image-field';
import { NameField } from './name-field';
import { NationalityField } from './nationality-field';
import { PhoneField } from './phone-field';

export const FormFields = () => {
  return (
    <>
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <NameField />
        </div>
        <div className="w-full lg:w-1/2">
          <EmailField />
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <PhoneField />
        </div>
        <div className="w-full lg:w-1/2">
          <ImageField />
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <NationalityField />
        </div>
        <div className="w-full lg:w-1/2">
          <DescriptionTextArea />
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
        <div className="w-full lg:w-1/2">
          <AgeField />
        </div>
        <div className="w-full lg:w-1/2 flex justify-end">
          <ActiveSwitch />
        </div>
      </div>
    </>
  );
};
