'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { EyeOff, Pencil } from 'lucide-react';
import { useImageGallery } from '~/src/store';
import styles from './styles.module.css';
import { DeleteGalleryImage } from '../delete-gallery-image';

type Props = Readonly<{
  galleryImage: {
    id: string;
    title: string;
    imageUrl: string;
    active: boolean;
    position: number;
  };
}>;

export const GalleryImage: FC<Props> = ({ galleryImage }) => {
  const { id, title, imageUrl, active, position } = galleryImage;
  const { setGalleryImage } = useImageGallery();

  return (
    <figure className={styles.imageContainer} aria-label={title}>
      <Image
        src={imageUrl}
        width={450}
        height={250}
        alt={title}
        className={styles.image}
      />

      {!active && (
        <>
          <div className={styles.backgroundOverlay} aria-hidden="true" />
          <Tooltip>
            <TooltipTrigger asChild>
              <EyeOff
                className={styles.hiddenIcon}
                aria-hidden="true"
              />
            </TooltipTrigger>
            <TooltipContent side="left">Oculta</TooltipContent>
          </Tooltip>
          <span className="sr-only">Imagen oculta</span>
        </>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="warning"
            className={styles.editButton}
            size="icon"
            aria-label={`Editar imagen: ${title}`}
            onClick={() => setGalleryImage({
              id,
              title,
              active,
              position,
            })}
          >
            <Pencil aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">editar</TooltipContent>
      </Tooltip>

      <DeleteGalleryImage imageId={id} />
    </figure>
  );
};
