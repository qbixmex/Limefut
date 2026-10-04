'use client';

import { Fragment, type FC } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { useCreateGallery } from '../use-create-gallery';
import { FormFields } from '../../(components)/form-fields';

export const CreateGalleryForm: FC = () => {
  const { form, onSubmit, handleNavigateBack } = useCreateGallery();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        aria-label="Formulario para crear galerías"
      >
        <FormFields />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={handleNavigateBack}
          >
            cancelar
          </Button>
          <Button
            type="submit"
            variant="outline-primary"
            size="lg"
            disabled={form.formState.isSubmitting}
            aria-label="Crear galería"
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span className="text-sm italic">Espere</span>
                <LoaderCircle
                  className="size-4 animate-spin"
                  role="img"
                  aria-label="Icono de carga"
                />
              </span>
            ) : (
              <Fragment>crear</Fragment>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
