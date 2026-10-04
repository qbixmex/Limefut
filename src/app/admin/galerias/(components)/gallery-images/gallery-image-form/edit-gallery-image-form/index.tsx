'use client';

import type { FC } from 'react';
import { Form } from '@/components/ui/form';
import { GalleryImageFormFields } from '../form-fields';
import { SubmitButton } from '../submit-button';
import { useEditGalleryImage } from '../use-edit-gallery-image';

type GalleryImageInput = Readonly<{
  id: string;
  title: string;
  active: boolean;
  position: number;
}>;

type Props = Readonly<{
  galleryImage: GalleryImageInput;
  onSuccess: () => void;
}>;

export const EditGalleryImageForm: FC<Props> = ({ galleryImage, onSuccess }) => {
  const { form, onSubmit } = useEditGalleryImage({ galleryImage, onSuccess });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        aria-label="Formulario para editar imagen"
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
