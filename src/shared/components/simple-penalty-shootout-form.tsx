'use client';

import type { FC } from 'react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SimplePenaltyShootoutsSchema } from '@/shared/schemas/penalty-shootout';
import type { z } from 'zod';
import { createRegularSimplePenaltyShootoutAction } from '@/app/admin/encuentros/(actions)/create-regular-simple-penalty-shootouts.action';
import { toast } from 'sonner';
import { createPlayoffSimplePenaltyShootoutAction } from '@/app/admin/liguilla/(actions)/create-playoff-simple-penalty-shootout.action';
import { LoaderCircle } from 'lucide-react';

type Props = Readonly<{
  userRoles: string[] | null | undefined;
  matchId: string;
  localTeam: Team;
  visitorTeam: Team;
  phase: 'regular' | 'playoffs';
}>;

type Team = {
  id: string;
  name: string;
};

export const SimplePenaltyShootoutForm: FC<Props> = ({
  userRoles,
  matchId,
  localTeam,
  visitorTeam,
  phase,
}) => {
  const form = useForm<z.infer<typeof SimplePenaltyShootoutsSchema>>({
    resolver: zodResolver(SimplePenaltyShootoutsSchema),
    defaultValues: {
      matchId,
      localTeamId: localTeam.id,
      visitorTeamId: visitorTeam.id,
      localGoals: 0,
      visitorGoals: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof SimplePenaltyShootoutsSchema>) => {
    const formData = new FormData();

    formData.append('matchId', data.matchId);
    formData.append('localTeamId', data.localTeamId);
    formData.append('visitorTeamId', data.visitorTeamId);
    formData.append('localGoals', data.localGoals.toString());
    formData.append('visitorGoals', data.visitorGoals.toString());

    let ok = false;
    let message = '';

    if (phase === 'regular') {
      const response = await createRegularSimplePenaltyShootoutAction(
        formData,
        userRoles,
      );

      ok = response.ok;
      message = response.message;
    }

    if (phase === 'playoffs') {
      const response = await createPlayoffSimplePenaltyShootoutAction(
        formData,
        userRoles,
      );

      ok = response.ok;
      message = response.message;
    }

    if (!ok) {
      toast.error(message);
      return;
    }

    toast.success(message);

    form.reset({
      matchId: '',
      localTeamId: '',
      visitorTeamId: '',
      localGoals: 0,
      visitorGoals: 0,
    });
  };

  return (
    <div className="w-full lg:w-1/2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-5 mb-10">
            <div className="w-1/3">
              <FormField
                control={form.control}
                name="localGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goles ({localTeam.name})</FormLabel>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-20"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/3">
              <FormField
                control={form.control}
                name="visitorGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goles ({visitorTeam.name})</FormLabel>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-20"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/3 self-end">
              <Button
                variant="outline-primary"
                type="submit"
                className="w-full lg:w-fit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                    <span className="text-sm italic">Espere</span>
                    <LoaderCircle className="size-4 animate-spin" />
                  </span>
                ) : (
                  <span>Guardar</span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
