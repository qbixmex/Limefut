import type { FC } from 'react';
import { ContentTextArea } from './content-text-area';
import { SeoTitleField } from './seo-title-field';
import { SeoRobotsSelect } from './seo-robots-select';
import { SeoDescriptionTextArea } from './seo-description-text-area';
import { StatusSelect } from './status-select';
import { PositionField } from './position-field';
import { TitlePermalinkFields } from '@/app/admin/noticias/(components)/form-fields/title-permalink-field';
import type { CustomPageImage } from '@/shared/interfaces/Page';

type Props = Readonly<{
  pageId: string;
  updateContentImage: (pageImage: CustomPageImage) => void;
}>;

export const FormFields: FC<Props> = ({ pageId, updateContentImage }) => {
  return (
    <>
      {/* Title and Permalink */}
      <section className="flex flex-col gap-5 lg:flex-row">
        <TitlePermalinkFields />
      </section>

      <h2 className="text-xl font-semibold text-sky-500">Contenido</h2>

      <section>
        <ContentTextArea
          pageId={pageId}
          updateContentImage={updateContentImage}
        />
      </section>

      <h2 className="text-xl font-semibold text-sky-500">SEO</h2>

      <section className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2 flex flex-col gap-5">
          <SeoTitleField />
          <SeoRobotsSelect />
        </div>
        <div className="w-full lg:w-1/2">
          <SeoDescriptionTextArea />
        </div>
      </section>

      {/* Position and Status */}
      <div className="flex justify-end gap-5">
        <div>
          <StatusSelect />
        </div>
        <div className="w-25">
          <PositionField />
        </div>
      </div>
    </>
  );
};
