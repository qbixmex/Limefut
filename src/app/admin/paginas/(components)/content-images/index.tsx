'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, LoaderCircle, X } from 'lucide-react';
import { useContentImage } from './use-content-image';
import { cn } from '@/lib/utils';
import type { CustomPageImage } from '@/shared/interfaces/Page';

type Props = Readonly<{
  pageId: string;
  contentImages: CustomPageImage[];
  onImageDeleted: (resourceId: string) => void;
}>;

export const ContentImages: FC<Props> = ({ pageId, contentImages, onImageDeleted }) => {
  const {
    isDeletingImage,
    copyToClipboard,
    handleDeleteImage,
  } = useContentImage(pageId, onImageDeleted);

  if (contentImages.length === 0) return null;

  return (
    <section>
      <h2 className="text-3xl mt-8 font-semibold mb-5">
        Imágenes del contenido
      </h2>
      <div className="flex flex-wrap gap-5">
        {contentImages.map((customPageImage) => (
          <figure key={customPageImage.resourceId} className="relative w-fit">
            <Image
              src={customPageImage.imageUrl}
              alt="Imagen del contenido"
              width={200}
              height={200}
              className="w-[150px] h-[150px] object-cover rounded-lg"
            />
            <div className="absolute top-0 right-0 w-full flex justify-between gap-2">
              <Button
                type="button"
                size="icon"
                className={cn('bg-cyan-600/70! hover:bg-cyan-600! cursor-pointer')}
                onClick={async () => {
                  const url = customPageImage.imageUrl;
                  const ok = await copyToClipboard(url);
                  if (ok) toast.success('URL copiada al portapapeles');
                  else toast('URL mostrada para copia manual');
                }}
              >
                <Copy className="size-[25px]" />
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="icon"
                disabled={isDeletingImage === customPageImage.imageUrl}
                className={cn('bg-pink-600/70! hover:bg-pink-600! cursor-pointer', {
                  'cursor-not-allowed bg-gray-500!': isDeletingImage === customPageImage.imageUrl,
                })}
                onClick={() => handleDeleteImage(customPageImage)}
              >
                {
                  isDeletingImage === customPageImage.imageUrl
                    ? <LoaderCircle className="animate-spin" />
                    : <X className="size-[25px]" />
                }
              </Button>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
};
