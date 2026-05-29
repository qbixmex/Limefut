'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type Props = Readonly<{ imageUrl?: string | null; }>;

export const ImageField: FC<Props> = ({ imageUrl }) => {
  return (
    <>
      {imageUrl && (
        <figure className="mb-5">
          <Image
            src={imageUrl}
            width={512}
            height={512}
            alt="Imagen de la noticia"
            className="rounded w-full max-w-[512px] h-auto object-cover"
          />
        </figure>
      )}
      <FormField
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Imagen <span className="text-gray-500">(opcional)</span>
            </FormLabel>
            <FormControl>
              <Input
                type="file"
                value={undefined}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  field.onChange(file);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
