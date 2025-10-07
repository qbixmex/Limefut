import type { FC, ReactNode } from 'react';

type Props = Readonly<{
  children?: ReactNode;
}>;

export const Container: FC<Props> = ({ children }) => {

  return (
    <div className="container mx-auto md:px-5">
      {children}
    </div>
  );

};

export default Container;
