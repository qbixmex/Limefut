'use client';

import type { FC } from 'react';
import { Form } from '@/components/ui/form';
import { FormFields } from '../../(components)/form-fields';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { useEditAnnouncement } from './use-edit-announcement';
import type { ANNOUNCEMENT_TYPE } from '../../(actions)/fetchAnnouncementAction';

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  announcement: ANNOUNCEMENT_TYPE;
}>;

export const EditAnnouncementForm: FC<Props> = ({
  authenticatedUserId,
  authenticatedUserRoles,
  announcement,
}) => {
  const {
    form,
    onSubmit,
    handleRedirectBack,
  } = useEditAnnouncement({
    announcement,
    authenticatedUserId,
    authenticatedUserRoles,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <FormFields imageUrl={announcement.imageUrl} />

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
              <span>guardar</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
