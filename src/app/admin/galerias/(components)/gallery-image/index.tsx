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
  galleyImage: {
    id: string;
    title: string;
    imageUrl: string;
    active: boolean;
    position: number;
  };
}>;

export const GalleryImage: FC<Props> = ({ galleyImage }) => {
  const { id, title, imageUrl, active, position } = galleyImage;
  const { setGalleryImage } = useImageGallery();

  return (
    <figure className={styles.imageContainer}>
      <Image
        src={imageUrl}
        width={450}
        height={250}
        alt={title}
        className={styles.image}
      />

      {!active && (
        <>
          <div className={styles.backgroundOverlay} />
          <Tooltip>
            <TooltipTrigger asChild>
              <EyeOff className={styles.hiddenIcon} />
            </TooltipTrigger>
            <TooltipContent side="left">Oculta</TooltipContent>
          </Tooltip>
        </>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="warning"
            className={styles.editButton}
            size="icon"
            onClick={() => setGalleryImage({
              id,
              title,
              active,
              position,
            })}
          >
            <Pencil />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">editar</TooltipContent>
      </Tooltip>

      <DeleteGalleryImage imageId={id} />
    </figure>
  );
};
