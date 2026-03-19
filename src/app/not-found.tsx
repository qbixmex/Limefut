import type { Metadata } from 'next';
import { NotFoundIcon } from '@/shared/components/icons/not-found';
import { Container, Footer, Header } from './(public)/components';

export const metadata: Metadata = {
  title: '¡ Página no encontrada !',
  description: 'La página que estas buscando no existe',
  robots: 'noindex, nofollow',
};

const NotFoundPage = () => {
  return (
    <Container>
      <Header />
        <main className="flex-1 flex flex-col">
          <div className="flex-1 wrapper flex flex-col justify-center items-center">
            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-pink-500">
              PÁGINA NO ENCONTRADA
            </h1>
            <NotFoundIcon
              strokeWidth={1}
              className="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] h-auto text-gray-500"
            />
          </div>
        </main>
      <Footer />
    </Container>
  );
};

export default NotFoundPage;
