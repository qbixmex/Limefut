import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchLatestImagesAction } from '../../(actions)/home/fetchLatestImagesAction';
import { Images } from 'lucide-react';
import './styles.css';

export const LatestImages: FC = async () => {
  const { latestImages } = await fetchLatestImagesAction();

  return (
    <section id="latest-images">
      <header id="header">
        <div className="logo-heading">
          <Images size={50} strokeWidth={1.5} />
          <p className="font-bold text-2xl">Últimas Imágenes</p>
        </div>
        <Link href="/imagenes" target='_blank'>
          ver todas
        </Link>
      </header>

      <div className="content">
        {(latestImages.length === 0) && (
          <p className="empty-message">No hay imágenes para mostrar</p>
        )}

        {(latestImages.length > 0) && (
          <section className="image-galleries">
            {latestImages.map((image) => (
              <figure key={image.id} className="figure">
                <Link href={`imagenes/${image.permalink}`}>
                  <Image
                    width={640}
                    height={360}
                    src={image.imageUrl}
                    alt={image.title}
                    className="main-image"
                  />
                  <figcaption>
                    {image.title}
                  </figcaption>
                </Link>
              </figure>
            ))}
          </section>
        )}
      </div>
    </section>
  );
};
