'use client';

import type { FC } from "react";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Pencil, XIcon } from "lucide-react";
import { useImageGallery } from "~/src/store";

type GalleryImageProps = Readonly<{
  images: {
    id: string;
    title: string;
    permalink: string;
    imageUrl: string;
    imagePublicID: string;
    active: boolean;
  }[];
}>;

export const GalleryImage: FC<GalleryImageProps> = ({ images }) => {
  const { setGalleryImage } = useImageGallery();

  const onDeleteImage = (imagePublicID: string) => {
    console.log(`Deleting image: ${imagePublicID}`);
  };

  return (
    <>
      {
        images.map(({ id, title, permalink, imageUrl, imagePublicID, active }) => (
          <figure key={id} className="space-y-2 relative">
            {<Image
              src={imageUrl}
              width={250}
              height={250}
              alt={title}
              className="size-[250px] rounded object-cover"
            />}
            <figcaption className="text-sm italic text-center text-gray-500">
              {title}
            </figcaption>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="warning"
                  className="absolute top-1 left-2"
                  size="icon"
                  onClick={() => setGalleryImage({ id, title, permalink, active })}
                >
                  <Pencil />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">editar</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-2"
                  onClick={() => onDeleteImage(imagePublicID)}
                >
                  <XIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">eliminar</TooltipContent>
            </Tooltip>
          </figure>
        ))
      }
    </>
  );
};