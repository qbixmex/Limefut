'use client';

import type { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { GalleryImage } from '../gallery-image';
import { Maximize2 } from 'lucide-react';
import styles from './styles.module.css';

type GalleryImageProps = Readonly<{
  images: {
    id: string;
    title: string;
    imageUrl: string;
    active: boolean;
    position: number;
  }[];
}>;

export const GalleryImages: FC<GalleryImageProps> = ({ images }) => {
  return (
    <>
      {images.map((image) => (
        <div key={image.id} className={styles.imageWrapper}>
          <GalleryImage galleyImage={image} />
          <p className={styles.position}>{image.position}</p>
          <Dialog key={image.id}>
            <DialogTrigger asChild>
              <button className={styles.maximizeBtn}>
                <Maximize2 size={20} />
              </button>
            </DialogTrigger>
            <DialogContent className={styles.dialogContent}>
              <DialogHeader>
                <DialogTitle className="mb-5">{image.title}</DialogTitle>
                <Image
                  src={image.imageUrl}
                  width={768}
                  height={768}
                  alt={image.title}
                  className="rounded"
                />
                <DialogDescription className="sr-only">
                  Imagen de {image.title}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </>
  );
};
