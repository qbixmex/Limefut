'use server';

import prisma from "@/lib/prisma";
import { uploadImage } from "@/shared/actions";
import type { CloudinaryResponse } from "@/shared/interfaces/Cloudinary";

type UploadArticleImageResponse = Promise<{
  message: string;
  cloudinaryResponse: CloudinaryResponse;
}>;

export const uploadPageContentImageAction = async (
  file: File,
  pageId: string,
): UploadArticleImageResponse => {
  if (!pageId) {
    throw new Error("¡ El ID de la página no fue proporcionado !");
  }

  const imageUploaded = await uploadImage(file!, 'pages');

  if (!imageUploaded) {
    throw new Error('Error uploading image to cloudinary');
  }

  await prisma.customPage.update({
    where: { id: pageId },
    data: {
      images: {
        create: {
          imageUrl: imageUploaded.secureUrl,
          publicId: imageUploaded.publicId,
        },
      },
    },
  });

  return {
    message: 'Image uploaded successfully 👍',
    cloudinaryResponse: imageUploaded,
  };
};
