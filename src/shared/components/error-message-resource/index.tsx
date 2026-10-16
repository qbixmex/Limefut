import type { FC } from 'react';
import styles from './styles.module.css';

type Props = Readonly<{ children: string }>;

export const ErrorMessageResource: FC<Props> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.message}>
        {children}
      </p>
    </div>
  );
};
