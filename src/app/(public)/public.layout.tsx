import type { FC, ReactNode } from 'react';
import { Container, Footer, Header } from './components';

type Props = Readonly<{
  children: ReactNode;
}>;

export const PublicLayout: FC<Props> = ({ children }) => {
  return (
    <Container>
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </Container>
  );
};

export default PublicLayout;
