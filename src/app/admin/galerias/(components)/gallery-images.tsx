'use client';

import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { GalleryImage } from "./gallery-image";
import { Maximize2 } from "lucide-react";
import "./styles.css";

type GalleryImageProps = Readonly<{
  images: {
    id: string;
    title: string;
    imageUrl: string;
    active: boolean;
    position: number;
  }[];
}>;

export const GalleryImages: FC<GalleryImageProps> = ({ images }) => {
  return (
    <>
      {images.map((image) => (
        <div key={image.id} className="w-full md:max-w-[450px] h-[250px] group relative">
          <GalleryImage galleyImage={image} />
          <p className="text-2xl text-transparent group-hover:text-white font-bold absolute top-[50%] left-[50%] -translate-[50%,50%] transition-colors duration-500 ease-in-out">
            {image.position}
          </p>
          <Dialog key={image.id}>
            <DialogTrigger asChild>
              <button className="absolute hover:bg-gray-500/50 focus:outline-0 p-2 rounded text-white right-2 bottom-5 z-20">
                <Maximize2 size={20} />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl md:max-w-3xl">
              <DialogHeader>
                <DialogTitle className="mb-5">{image.title}</DialogTitle>
                <Image
                  src={image.imageUrl}
                  width={768}
                  height={768}
                  alt={image.title}
                  className="rounded"
                />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </>
  );
};