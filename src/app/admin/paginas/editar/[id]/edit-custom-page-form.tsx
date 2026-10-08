'use client';

import type { FC } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { useEditCustomPage } from './use-edit-custom-page';
import { FormFields } from '../../(components)/form-fields';
import type { CUSTOM_PAGE_TYPE } from '../../(actions)/fetchPageAction';
import { ContentImages } from '../../(components)/content-images';
import './styles.css';

type Props = Readonly<{ customPage: CUSTOM_PAGE_TYPE }>;

export const EditCustomPageForm: FC<Props> = ({ customPage }) => {
  const {
    form,
    route,
    onSaveDraft,
    isDraft,
    onSubmit,
    updateContentImage,
    contentImages,
    removeContentImage,
  } = useEditCustomPage(customPage);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormFields
          pageId={customPage.id}
          updateContentImage={updateContentImage}
        />

        <ContentImages
          pageId={customPage.id}
          contentImages={contentImages}
          onImageDeleted={removeContentImage}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={() => route.replace('/admin/paginas')}
          >
            cancelar
          </Button>

          <Button
            type="submit"
            variant="outline-primary"
            size="lg"
            disabled={form.formState.isSubmitting}
            onClick={onSaveDraft}
          >
            {form.formState.isSubmitting && isDraft ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span className="text-sm italic">guardando</span>
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              <span>guardar</span>
            )}
          </Button>

          <Button
            type="submit"
            variant="outline-success"
            size="lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && !isDraft ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span className="text-sm italic">publicando</span>
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              <span>guardar y cerrar</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
