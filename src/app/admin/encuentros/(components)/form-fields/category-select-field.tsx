'use client';

import { useState, type FC } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { Category } from './form-types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

type Props = Readonly<{ categories: Category[] }>;

export const CategorySelectField: FC<Props> = ({ categories }) => {
  const [open, setOpen] = useState(false);
  const { control } = useFormContext();
  const tournament = useWatch({ name: 'tournament' });
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const router = useRouter();

  const isDisabled = !tournament;

  const setCategorySearchParam = (permalink: string) => {
    params.set('category', permalink);
    router.replace(`${pathname}?${params}`);
  };

  return (
    <Controller
      name="category"
      control={control}
      render={({ field, fieldState }) => {
        const selectedCategory = categories.find((c) => c.permalink === field.value);

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Categoría</FieldLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline-secondary"
                  role="combobox"
                  aria-expanded={open}
                  disabled={isDisabled}
                  className={cn(
                    'w-full justify-between border-input dark:text-gray-300! dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
                    { 'border-destructive!': fieldState.invalid },
                  )}
                >
                  {selectedCategory
                    ? selectedCategory.name
                    : isDisabled
                      ? 'Seleccione un torneo primero'
                      : 'Seleccione una categoría'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Buscar categoría" className="h-9" />
                  <CommandList>
                    <CommandEmpty>
                      {categories.length > 0
                        ? 'No se encontró la categoría.'
                        : 'Aún no hay categorías disponibles'}
                    </CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category.id}
                          value={category.name}
                          onSelect={(currentValue) => {
                            const selected = categories.find((c) => c.name === currentValue);
                            if (selected) {
                              setCategorySearchParam(selected.permalink);
                              field.onChange(selected.permalink);
                            }
                            setOpen(false);
                          }}
                        >
                          {category.name}
                          <Check
                            className={cn(
                              'ml-auto',
                              field.value === category.permalink ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        );
      }}
    />
  );
};
