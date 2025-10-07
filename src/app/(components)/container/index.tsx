import type { FC, ReactNode } from 'react';

type Props = Readonly<{
  children?: ReactNode;
}>;

export const Container: FC<Props> = ({ children }) => {

  return (
    <div className="container mx-auto md:px-5 flex flex-col gap-3 min-h-screen">
      {children}
    </div>
  );

};

export default Container;
