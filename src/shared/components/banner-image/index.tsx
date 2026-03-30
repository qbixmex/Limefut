import type { FC } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import './styles.css';

type Props = Readonly<{
  title: string;
  imageUrl: string;
  dataAlignment: string;
  description: string;
  position: number;
  showData?: boolean;
  className?: string;
}>;

export const BannerImage: FC<Props> = (props) => {
  const {
    title,
    imageUrl,
    dataAlignment,
    description,
    position,
    showData = false,
    className = '',
  } = props;

  return (
    <figure className="figure-container">
      <Image
        src={imageUrl}
        width={1280}
        height={548}
        alt={title ?? 'Imagen del Banner'}
        className={cn('banner-image', className)}
        loading={position === 1 ? 'eager' : 'lazy'}
      />
      {showData && (
        <section>
          <h2 className={cn('heading', {
            'align-left': dataAlignment === 'left',
            'align-center': dataAlignment === 'center',
            'align-right': dataAlignment === 'right',
          })}>
            {title}
          </h2>

          <p className={cn('description', {
            'align-left': dataAlignment === 'left',
            'align-center': dataAlignment === 'center',
            'align-right': dataAlignment === 'right',
          })}>
            {description}
          </p>
        </section>
      )}
    </figure>
  );
};
