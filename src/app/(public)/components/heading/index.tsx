import type { FC, ReactNode } from 'react';

type Props = Readonly<{
  children: ReactNode;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  style?: React.CSSProperties;
}>;

export const Heading: FC<Props> = ({ children, className, style, level = 'h1' }) => {
  const Tag = level;
  const id = `heading-${level.at(1)}`;

  return (
    <Tag id={id} className={className} style={style}>
      {children}
    </Tag>
  );
};

export default Heading;
