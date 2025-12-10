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

import "./styles.css";
import { GalleryImage } from "./gallery-image";
import { Maximize2 } from "lucide-react";

type GalleryImageProps = Readonly<{
  images: {
    id: string;
    title: string;
    permalink: string;
    imageUrl: string;
    active: boolean;
  }[];
}>;

export const GalleryImages: FC<GalleryImageProps> = ({ images }) => {
  return (
    <>
      {images.map((image) => (
        <div key={image.id} className="relative">
          <GalleryImage galleyImage={image} />
          <Dialog key={image.id}>
            <DialogTrigger asChild>
              <button
                className="absolute hover:bg-gray-500/50 focus:outline-0 p-2 rounded text-white right-2 bottom-5 z-20"
              >
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