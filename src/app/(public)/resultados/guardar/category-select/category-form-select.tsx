'use client';

import type { FC } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CATEGORY_TYPE } from '../../(actions)/fetchPublicCategoriesAction';

type Props = Readonly<{
  categories: CATEGORY_TYPE[];
}>;

export const CategoryFormSelect: FC<Props> = ({ categories }) => {
  const { control, setValue } = useFormContext();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setCategorySearchParam = (categoryPermalink: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('category', categoryPermalink);
    router.push(`${pathname}?${params}`);
  };

  return (
    <section className="mb-5">
      <Controller
        name="category"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>
              Categoría <span className="text-amber-500">*</span>
            </FieldLabel>
            <Select
              name={field.name}
              value={field.value}
              onValueChange={(categoryPermalink) => {
                const category = categories.find(c => c.permalink === categoryPermalink);
                if (category) {
                  setCategorySearchParam(category.permalink);
                }
                field.onChange(categoryPermalink);
                setValue('teamsIds', []);
              }}
            >
              <SelectTrigger
                aria-invalid={fieldState.invalid}
                className="min-w-30"
              >
                <SelectValue placeholder="seleccione categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.permalink}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </section>
  );
};
