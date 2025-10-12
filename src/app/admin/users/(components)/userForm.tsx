'use client';

import { type FC } from 'react';
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from '@/components/ui/input';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { createUserSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserAction } from '../(actions)';
import { Session } from 'next-auth';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Role } from '@/shared/interfaces';

const roles = [
  { value: "user", label: "Usuario" },
  { value: "admin", label: "Administrador" },
];

type Props = Readonly<{
  session: Session | null;
}>;

export const UserForm: FC<Props> = ({ session }) => {
  const route = useRouter();

  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      imageUrl: '',
      password: '',
      passwordConfirmation: '',
      roles: ['user'],
      isActive: false,
    }
  });

  const onSubmit = async (data: z.infer<typeof createUserSchema>) => {
    const formData = new FormData();

    formData.append('name', data.name);
    if (data.username) formData.append('username', data.username);
    formData.append('email', data.email);
    if (data.imageUrl) formData.append('imageUrl', data.imageUrl);
    formData.append('password', data.password);
    formData.append('passwordConfirmation', data.passwordConfirmation);
    formData.append('roles', JSON.stringify(data.roles));
    formData.append('isActive', String(data.isActive ?? false));

    // Create user
    const response = await createUserAction(
      formData,
      session?.user.roles ?? null
    );

    console.log(response);

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    if (response.ok) {
      toast.success(response.message);
      form.reset();
      route.replace("/admin/users");
      return;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Name and Username */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre de usuario
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Email and Image URL */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Correo Electrónico
                  </FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Url de la Imagen
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Passwords */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Roles and isActive */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline-secondary"
                          role="combobox"
                          className="w-[200px] justify-between"
                        >
                          {(field.value?.length > 0)
                            ? `${field.value.length} rol${field.value.length < 2 ? '' : 'es'} seleccionado${field.value.length < 2 ? '' : 's'}`
                            : "Seleccione un rol"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search framework..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No se encontraron roles.</CommandEmpty>
                            <CommandGroup>
                              {roles.map((role) => (
                                <CommandItem
                                  key={role.value}
                                  value={role.value}
                                  onSelect={(currentValue) => {
                                    const currentRoles = field.value || [];
                                    if (currentRoles.includes(currentValue as Role)) {
                                      // Remove if already selected
                                      field.onChange(currentRoles.filter(r => r !== currentValue));
                                    } else {
                                      // Add role if not selected
                                      field.onChange([...currentRoles, currentValue]);
                                    }
                                  }}
                                >
                                  {role.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value?.includes(role.value as Role) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  {field.value?.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {field.value.map((roleValue) => {
                        const role = roles.find(r => r.value === roleValue);
                        return (
                          <Badge key={roleValue} variant="secondary" className="text-xs">
                            {role?.label}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Switch
                        id="isActive"
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Label htmlFor="isActive">Activo</Label>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={() => route.back()}
          >
            cancelar
          </Button>
          <Button
            type="submit"
            variant="outline-primary"
            size="lg"
          >
            crear
          </Button>
        </div>
      </form>
    </Form>
  );

};

export default UserForm;
