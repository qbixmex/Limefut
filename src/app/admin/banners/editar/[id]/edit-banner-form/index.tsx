'use client';

import type { FC } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import type { HeroBanner } from '@/shared/interfaces';
import { useEditBanner } from '../use-edit-banner';
import { FormFields } from '../../../(components)/form-fields';

type Props = Readonly<{ heroBanner: HeroBanner }>;

export const EditBannerForm: FC<Props> = ({ heroBanner }) => {
  const { form, onSubmit, handleNavigateBack } = useEditBanner({ heroBanner });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormFields showMetaFields />

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
            aria-label="Guardar banner"
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span className="text-sm italic">Espere</span>
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              <span>actualizar</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
