import type { FC } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import styles from './styles.module.css';

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
    <figure className={styles.figureContainer}>
      <Image
        src={imageUrl}
        width={1280}
        height={548}
        alt={title ?? 'Imagen del Banner'}
        className={cn('banner-image', className)}
        loading={position === 1 ? 'eager' : 'lazy'}
      />
      {showData && (
        <section className={styles.dataWrapper}>
          <h2 className={cn(styles.heading, {
            'align-left': dataAlignment === 'left',
            'align-center': dataAlignment === 'center',
            'align-right': dataAlignment === 'right',
          })}
          >
            {title}
          </h2>

          <p className={cn(styles.description, {
            [styles.alignLeft]: dataAlignment === 'left',
            [styles.alignCenter]: dataAlignment === 'center',
            [styles.alignRight]: dataAlignment === 'right',
          })}
          >
            {description}
          </p>
        </section>
      )}
    </figure>
  );
};
