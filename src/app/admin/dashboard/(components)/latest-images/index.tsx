import type { FC } from 'react';
import { fetchLatestImagesAction } from '../../(actions)/fetchLatestImagesAction';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const LatestImages: FC = async () => {
  const { latestImages } = await fetchLatestImagesAction({ quantity: 4 });

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-emerald-500 text-2xl font-semibold mb-4 space-x-2">
        <span>Imágenes Recientes</span>
        <span className="italic text-sm font-normal text-emerald-700">(30 días)</span>
      </h2>
      {
        (latestImages.length === 0) && (
          <div className="flex-1 border border-gray-400 dark:border-blue-500/50 flex justify-center items-center rounded-lg">
            <p className="text-xl text-gray-500 dark:text-blue-600 font-semibold">No hay imágenes para mostrar</p>
          </div>
        )
      }
      <div className="grid grid-cols-2 gap-4">
        {(latestImages.length > 0) && latestImages.map(({ id, title, imageUrl }) => (
          <Dialog key={id}>
            <DialogTrigger asChild>
              <figure className="relative overflow-hidden group rounded cursor-pointer">
                <Image
                  src={imageUrl}
                  width={100}
                  height={100}
                  alt={`${title} miniatura`}
                  className="w-full h-25 object-cover object-top z-0"
                />
                <div className="w-full h-25 bg-black/30 group-hover:bg-black/0 absolute top-0 left-0 z-10" />
              </figure>
            </DialogTrigger>
            <DialogContent className="max-w-4xl md:max-w-3xl">
              <DialogHeader>
                <DialogTitle className="mb-5">{title}</DialogTitle>
                <Image
                  src={imageUrl}
                  width={768}
                  height={768}
                  alt={title}
                  className="rounded"
                />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default LatestImages;
