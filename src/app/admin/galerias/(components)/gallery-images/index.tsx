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
import { GalleryImage } from './gallery-image';
import { Maximize2 } from 'lucide-react';
import { EmptyMessageResource } from '@/shared/components/empty-message-resource';
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
    <section>
      <h2 className={styles.title}>Imágenes</h2>

      {
        images.length > 0 ? (
          <div className={styles.galleryLayout}>
            {images.map((image) => (
              <div key={image.id} className={styles.imageWrapper}>
                <GalleryImage galleryImage={image} />
                <p
                  className={styles.position}
                  role="status"
                  aria-label={`Posición de la imagen ${image.title}`}
                >
                  {image.position}
                </p>
                <Dialog key={image.id}>
                  <DialogTrigger asChild>
                    <button
                      className={styles.maximizeBtn}
                      aria-label={`Ampliar imagen: ${image.title}`}
                    >
                      <Maximize2 aria-hidden="true" size={20} />
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
          </div>
        ) : (
          <EmptyMessageResource>
            La galería aún no tiene imágenes
          </EmptyMessageResource>
        )
      }
    </section>
  );
};
