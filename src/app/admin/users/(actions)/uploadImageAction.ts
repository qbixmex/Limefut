"use server";

import { CloudinaryResponse } from "@/shared/interfaces";
import { v2 as cloudinary } from "cloudinary";
import { pad, slugify } from "@/lib/utils";

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const uploadImage = async (image: File, folder: 'users' | 'articles'): Promise<(CloudinaryResponse | null) | null> => {
  try {
    const buffer = await image.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');

    const originalName = image.name ?? crypto.randomUUID();
    const sanitized = slugify(originalName);

    // Build timestamp like: 2025-04-22_14-35-45-232
    const now = new Date();
    const timestamp = now.getFullYear()
      + `-${pad(now.getMonth() + 1)}`
      + `-${pad(now.getDate())}`
      + `_${pad(now.getHours())}`
      + `-${pad(now.getMinutes())}`
      + `-${pad(now.getSeconds())}`
      + `.${pad(now.getMilliseconds(), 3)}`;

    // Use the real file MIME type if available
    const mime = image.type || 'image/jpeg';
    const dataUri = `data:${mime};base64,${base64Image}`;

    const seoPublicId = `${sanitized}-${timestamp}`;

    const response = await cloudinary.uploader.upload(dataUri, {
      folder: `/${folder}`,
      public_id: seoPublicId,
      // Automatic Transformations
      transformation: [
        {
          crop: 'fill', // Fill the entire area
          gravity: 'auto', // Automatically determine the focal point
          format: "webp", // Use webp format
          quality: "auto:good", // Automatic Quality
        }
      ],
      // Additional optimization configurations
      format: "webp", // Force (webp) format
      quality: "auto:good", // Automatic Quality
      fetch_format: "auto", // Detects best format for browser
    });

    return {
      publicId: response.public_id,
      secureUrl: response.secure_url,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default uploadImage;
