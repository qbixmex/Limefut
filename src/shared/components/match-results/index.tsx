import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldBan } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './styles.module.css';

type Team = Readonly<{
  name: string;
  href: string;
  imageUrl?: string | null;
}>;

type Props = Readonly<{
  local: Team;
  visitor: Team;
  localScore?: number | string | null;
  visitorScore?: number | string | null;
  className?: string;
}>;

export const MatchResults: FC<Props> = ({
  local,
  visitor,
  localScore,
  visitorScore,
  className,
}) => (
  <div className={cn(styles.wrapper, className)}>
    <div className={cn(styles.team, styles.teamLocal)}>
      <Link href={local.href} target="_blank" rel="noreferrer">
        {local.imageUrl ? (
          <Image
            src={local.imageUrl}
            width={100}
            height={100}
            alt={`${local.name} escudo`}
            className={styles.shield}
          />
        ) : (
          <ShieldBan size={80} strokeWidth={1} className="stroke-gray-400" />
        )}
      </Link>
      <div className={styles.teamName}>
        <Link
          href={local.href}
          className="text-gray-100"
          target="_blank"
          rel="noreferrer"
        >
          {local.name}
        </Link>
      </div>
    </div>

    <div className={cn(styles.team, styles.teamVisitor)}>
      <Link href={visitor.href} target="_blank" rel="noreferrer">
        {visitor.imageUrl ? (
          <Image
            src={visitor.imageUrl}
            width={100}
            height={100}
            alt={`${visitor.name} escudo`}
            className={styles.shield}
          />
        ) : (
          <ShieldBan size={80} strokeWidth={1} className="stroke-gray-400" />
        )}
      </Link>
      <div className={styles.teamName}>
        <Link
          href={visitor.href}
          className="text-gray-100"
          target="_blank"
          rel="noreferrer"
        >
          {visitor.name}
        </Link>
      </div>
    </div>

    <div className={styles.matchResults}>
      <p>
        <span role="status" aria-label="Anotaciones del equipo local">
          {localScore}
        </span>
        <span role="status" aria-label="Anotaciones del equipo visitante">
          {visitorScore}
        </span>
      </p>
    </div>

    <span className={styles.fieldDivider} />
    <span className={styles.fieldDot} />
  </div>
);
