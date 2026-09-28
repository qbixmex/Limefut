import type { FC } from 'react';
import styles from './styles.module.css';

type Props = Readonly<{ children: string }>;

export const EmptyMessageResource: FC<Props> = ({ children }) => {
  return (
    <div className={styles.emptyResourceMessage}>
      <p className={styles.description}>
        {children}
      </p>
    </div>
  );
};
