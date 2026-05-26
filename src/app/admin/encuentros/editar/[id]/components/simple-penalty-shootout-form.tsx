'use client';

import type { FC } from 'react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SimplePenaltyShootoutsSchema } from '@/shared/schemas/penalty-shootout';
import type { z } from 'zod';
import { createSimplePenaltyShootoutAction } from '@/app/admin/encuentros/(actions)/create-simple-penalty-shootouts.action';
import { toast } from 'sonner';

type Props = Readonly<{
  userRoles: string[] | null | undefined;
  matchId: string;
  localTeam: Team;
  visitorTeam: Team;
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

    const { ok, message } = await createSimplePenaltyShootoutAction(
      formData,
      userRoles,
    );

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
            <div className="w-full">
              <FormField
                control={form.control}
                name="localGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goles ({localTeam.name})</FormLabel>
                    <Input
                      {...field}
                      type='number'
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
            <div className="w-full">
              <FormField
                control={form.control}
                name="visitorGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goles ({visitorTeam.name})</FormLabel>
                    <Input
                      {...field}
                      type='number'
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
          </div>

          <div className="flex lg:justify-end">
            <Button
              variant="outline-primary"
              type="submit"
              className="w-full lg:w-fit"
            >Guardar</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
