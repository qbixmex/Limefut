'use server';

import { updateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import { uploadImage } from '@/shared/actions';
import type { CloudinaryResponse } from '@/shared/interfaces/Cloudinary';

type UploadArticleImageResponse = Promise<{
  message: string;
  cloudinaryResponse: CloudinaryResponse | null;
}>;

export const uploadPageContentImageAction = async (
  file: File,
  pageId: string,
): UploadArticleImageResponse => {
  const imageUploaded = await uploadImage(file, 'pages');

  if (!imageUploaded) {
    return {
      message: '¡ No se pudo subir la imagen ❌ !',
      cloudinaryResponse: null,
    };
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

  // Update Cache
  updateTag('admin-page');

  return {
    message: '¡ Imagen cargada satisfactoriamente 👍 !',
    cloudinaryResponse: imageUploaded,
  };
};
