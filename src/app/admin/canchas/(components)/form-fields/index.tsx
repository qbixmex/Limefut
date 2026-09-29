import { NamePermalinkFields } from './name-permalink-fields';
import { CityField } from './city-field';
import { StateField } from './state-field';
import { CountryField } from './country-field';
import { AddressField } from './address-field';
import { MapField } from './map-field';

export const FormFields = () => {
  return (
    <>
      <NamePermalinkFields />

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <CityField />
        </div>
        <div className="w-full lg:w-1/2">
          <StateField />
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <CountryField />
        </div>
        <div className="w-full lg:w-1/2">
          <AddressField />
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <MapField />
        </div>
      </div>
    </>
  );
};
