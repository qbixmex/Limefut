'use client';

import type { FC } from 'react';
import { Fragment } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { useCreateVideo } from './use-create-video';
import { FormFields } from '../(components)/form-fields';

export const CreateVideoForm: FC = () => {
  const { form, handleRedirectBack, onSubmit } = useCreateVideo();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
        aria-label="Formulario para crear videos"
      >
        <FormFields />

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={handleRedirectBack}
            aria-label="Volver a la lista de videos"
          >
            cancelar
          </Button>

          <Button
            type="submit"
            variant="outline-primary"
            size="lg"
            disabled={form.formState.isSubmitting}
            aria-label="Crear video"
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span className="text-sm italic">guardando</span>
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
