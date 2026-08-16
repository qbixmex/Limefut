'use client';

import type { FC } from 'react';
import { Form } from '@/components/ui/form';
import { useCreateAnnouncement } from './use-create-announcement';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { FormFields } from '../(components)/form-fields';

export const CreateAnnouncementForm: FC = () => {
  const {
    form,
    onSubmit,
    handleRedirectBack,
  } = useCreateAnnouncement();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
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
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span className="text-sm italic">guardando</span>
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              <span>crear</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
