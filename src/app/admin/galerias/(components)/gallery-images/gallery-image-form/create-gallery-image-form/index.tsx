'use client';

import type { FC } from 'react';
import { Form } from '@/components/ui/form';
import { GalleryImageFormFields } from '../form-fields';
import { SubmitButton } from '../submit-button';
import { useCreateGalleryImage } from '../use-create-gallery-image';

type Props = Readonly<{
  galleryId: string;
  imagesQuantity: number;
  onSuccess: () => void;
}>;

export const CreateGalleryImageForm: FC<Props> = ({
  galleryId,
  imagesQuantity,
  onSuccess,
}) => {
  const { form, onSubmit } = useCreateGalleryImage({
    galleryId,
    imagesQuantity,
    onSuccess,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        aria-label="Formulario para subir imagen"
      >
        <GalleryImageFormFields />

        <SubmitButton
          isSubmitting={form.formState.isSubmitting}
          label="Guardar"
        />
      </form>
    </Form>
  );
};
