"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

/**
 * Eliminates an image from Cloudinary.
 * @param publicId The public ID of the image to delete from Cloudinary.
 * This is typically the path to the image without the file extension.
 * For example, if the image URL is:
 * `https://res.cloudinary.com/acount_name/image/upload/v3857362705/articles/12f23f85-eeba-4569-8de2-3dce913e0ccb.jpg`\n
 * `articles/12f23f85-eeba-4569-8de2-3dce913e0ccb` is the public ID.
 * @example ```typescript
 * deleteImage("articles/12f23f85-eeba-4569-8de2-3dce913e0ccb");
 * ```
 * @returns 
 */
const deleteImage = async (publicId: string): Promise<{ ok: boolean }> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false };
  }
};

export default deleteImage;
