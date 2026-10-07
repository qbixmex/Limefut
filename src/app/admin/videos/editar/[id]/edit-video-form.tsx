'use client';

import type { FC } from 'react';
import { Fragment } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import type { VIDEO_TYPE } from '../../(actions)';
import { LoaderCircle } from 'lucide-react';
import { FormFields } from '../../(components)/form-fields';
import { useEditVideo } from './use-edit-video';

type Props = Readonly<{
  video: VIDEO_TYPE;
}>;

export const EditVideoForm: FC<Props> = ({ video }) => {
  const { form, handleRedirectBack, onSubmit } = useEditVideo(video);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
        aria-label="Formulario para editar videos"
      >
        <FormFields />

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={handleRedirectBack}
          >
            cancelar
          </Button>

          <Button
            type="submit"
            variant="outline-primary"
            size="lg"
            disabled={form.formState.isSubmitting}
            aria-label="Guardar video"
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
              <Fragment>guardar</Fragment>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
