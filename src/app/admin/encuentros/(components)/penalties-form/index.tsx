'use client';

import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { createPenaltiesSchema } from './createSchema';
import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';

type Props = Readonly<{
  currentMatchId: string;
  teams: {
    id: string;
    name: string;
  }[];
}>;

export const PenaltiesForm: FC<Props> = ({ currentMatchId, teams }) => {
  const formSchema = createPenaltiesSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matchId: currentMatchId,
      teamId: '',
      shooterNumber: 0,
      isGoal: false,
      shooterName: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("DATA:", data);
    // const formData = new FormData();

    //  formData.append('name', data.name as string);

    // Create match
    // if (!penalty) {
    //   const response = await createPenaltyAction(
    //     formData,
    //     session?.user.roles ?? null,
    //   );

    //   if (!response.ok) {
    //     toast.error(response.message);
    //     return;
    //   }

    //   if (response.ok) {
    //     toast.success(response.message);
    //     form.reset();
    //     route.replace("/admin/<<lorem>>");
    //     return;
    //   }
    //   return;
    // }

    // Update match
    // if (penalty) {
    //   const response = await updatePenaltyAction({
    //     formData,
    //     id: match.id,
    //     userRoles: session.user.roles,
    //     authenticatedUserId: session?.user.id,
    //   });

    //   if (!response.ok) {
    //     toast.error(response.message);
    //     return;
    //   }

    //   if (response.ok) {
    //     toast.success(response.message);
    //     route.replace("/admin/<<lorem>>");
    //     return;
    //   }
    //   return;
    // }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center gap-3">
            <FormField
              control={form.control}
              name="shooterNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Camiseta</FormLabel>
                  <FormControl>
                    <Input
                      id="shooterNumber"
                      type="number"
                      {...field}
                      min={0}
                      value={field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-[75px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shooterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tirador</FormLabel>
                  <FormControl>
                    <Input
                      id="shooterName"
                      type="text"
                      {...field}
                      className="w-full lg:min-w-[150px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipo</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Seleccione Equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {teams.map((team) => (
                          <SelectItem
                            key={team.id}
                            value={team.id}
                          >
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="w-full pt-5">
              <Button
                type="submit"
                variant="outline-primary"
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                    <span className="text-sm italic">Espere</span>
                    <LoaderCircle className="size-4 animate-spin" />
                  </span>
                ) : (
                  true ? 'crear' : 'actualizar'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default PenaltiesForm;
