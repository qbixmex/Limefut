import type { FC, ReactNode } from 'react';
import styles from "./styles.module.css";
import { cn } from '@/lib/utils';

type Props = Readonly<{
  children: ReactNode;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  style?: React.CSSProperties;
}>;

export const Heading: FC<Props> = ({ children, className, style, level = 'h1' }) => {
  const Tag = level;

  return (
    <Tag className={cn(className, {
      [styles.headingOne]:   level === 'h1',
      [styles.headingTwo]:   level === 'h2',
      [styles.headingThree]: level === 'h3',
      [styles.headingFour]:  level === 'h4',
      [styles.headingFive]:  level === 'h5',
      [styles.headingSix]:   level === 'h6',
    })} style={style}>
      {children}
    </Tag>
  );
};

export default Heading;
