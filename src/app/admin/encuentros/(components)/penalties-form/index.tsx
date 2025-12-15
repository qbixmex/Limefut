'use client';

import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
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
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { createPenaltyShootoutSchema } from '~/src/shared/schemas';

type Props = Readonly<{
  currentMatchId: string;
}>;

export const PenaltiesForm: FC<Props> = ({ currentMatchId }) => {
  const formSchema = createPenaltyShootoutSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matchId: currentMatchId,
      localTeamId: '',
      localPlayerId: '',
      visitorTeamId: '',
      visitorPlayerId: '',
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
          <div className="grid grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="localTeamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipo Local</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione Equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="abc">Real San José</SelectItem>
                        <SelectItem value="cde">Búfalos FC</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="localPlayerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tirador Local</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione Jugador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1">Alejandro Pérez</SelectItem>
                        <SelectItem value="2">Carlos Muñoz</SelectItem>
                        <SelectItem value="3">Fernando Fernandez</SelectItem>
                        <SelectItem value="4">Jorge López</SelectItem>
                        <SelectItem value="5">Luis Ochoa</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visitorTeamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipo Visitante</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione Equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="abc">Real San José</SelectItem>
                        <SelectItem value="cde">Búfalos FC</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visitorPlayerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tirador Visitante</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione Jugador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1">Alejandro Pérez</SelectItem>
                        <SelectItem value="2">Carlos Muñoz</SelectItem>
                        <SelectItem value="3">Fernando Fernandez</SelectItem>
                        <SelectItem value="4">Jorge López</SelectItem>
                        <SelectItem value="5">Luis Ochoa</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="w-full flex lg:justify-end pt-5">
            <Button
              type="submit"
              variant="outline-primary"
              disabled={form.formState.isSubmitting}
              className="w-full lg:w-auto"
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
        </form>
      </Form>
    </>
  );
};

export default PenaltiesForm;
