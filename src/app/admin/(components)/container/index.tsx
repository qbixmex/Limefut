import type { FC, ReactNode } from 'react';
import styles from "./styles.module.css";

type Props = Readonly<{
  children?: ReactNode;
}>;

export const Container: FC<Props> = ({ children }) => {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
};

export default Container;
