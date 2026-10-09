'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, LoaderCircle, X } from 'lucide-react';
import { useContentImage } from './use-content-image';
import { cn } from '@/lib/utils';
import type { CustomPageImage } from '@/shared/interfaces/Page';
import styles from './styles.module.css';

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
      <h2 className={styles.heading}>
        Imágenes del contenido
      </h2>
      <div className={styles.imagesList}>
        {contentImages.map((customPageImage) => (
          <figure key={customPageImage.resourceId} className={styles.imageWrapper}>
            <Image
              src={customPageImage.imageUrl}
              alt="Imagen del contenido"
              width={200}
              height={200}
              className={styles.image}
            />
            <div className={styles.actions}>
              <Button
                type="button"
                size="icon"
                aria-label="Copiar URL de la imagen"
                className={styles.copyButton}
                onClick={async () => {
                  const url = customPageImage.imageUrl;
                  const ok = await copyToClipboard(url);
                  if (ok) toast.success('URL copiada al portapapeles');
                  else toast('URL mostrada para copia manual');
                }}
              >
                <Copy className={styles.icon} />
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="icon"
                aria-label="Eliminar imagen"
                disabled={isDeletingImage === customPageImage.imageUrl}
                className={cn(styles.deleteButton, {
                  [styles.deleteButtonDisabled]: isDeletingImage === customPageImage.imageUrl,
                })}
                onClick={() => handleDeleteImage(customPageImage)}
              >
                {
                  isDeletingImage === customPageImage.imageUrl
                    ? <LoaderCircle className={styles.spinner} />
                    : <X className={styles.icon} />
                }
              </Button>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
};
