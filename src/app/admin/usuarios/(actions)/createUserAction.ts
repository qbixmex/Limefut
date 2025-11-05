'use server';

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createUserSchema } from "@/shared/schemas";
import { uploadImage } from '@/shared/actions';
import { revalidatePath } from "next/cache";
import type { CloudinaryResponse } from "@/shared/interfaces";
import type { User } from "@/root/next-auth";

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  user: User | null;
}>;

export const createUserAction = async (
  formData: FormData,
  userRole: string[] | null,
): CreateResponseAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      user: null,
    };
  }

  const imageFile = formData.get('image');

  const rawData = {
    name: formData.get('name') as string,
    username: formData.get('username') ?? '',
    email: formData.get('email') as string,
    image: (imageFile instanceof File && imageFile.size > 0) ? imageFile : undefined,
    password: formData.get('password') as string,
    passwordConfirmation: formData.get('passwordConfirmation') as string,
    roles: JSON.parse(formData.get('roles') as string),
    isActive: (formData.get('isActive') === 'true')
      ? true
      : (formData.get('isActive') === 'false')
        ? false
        : false,
  };

  const userVerified = createUserSchema.safeParse(rawData);

  if (!userVerified.success) {
    return {
      ok: false,
      message: userVerified.error.message,
      user: null,
    };
  }

  const { image, ...userToSave } = userVerified.data;

  // Upload Image to third-party storage (cloudinary).
  let cloudinaryResponse: CloudinaryResponse | null = null;

  if (image) {
    cloudinaryResponse = await uploadImage(image!, 'users');
    if (!cloudinaryResponse) {
      throw new Error('Error al subir la imagen a cloudinary');
    }
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdUser = await transaction.user.create({
        data: {
          ...userToSave,
          imageUrl: cloudinaryResponse?.secureUrl,
          imagePublicID: cloudinaryResponse?.publicId,
          password: bcrypt.hashSync(userToSave.password, 10),
        }
      });

      return {
        ok: true,
        message: '¡ Usuario creado satisfactoriamente 👍 !',
        user: createdUser,
      };
    });

    // Revalidate Paths
    revalidatePath('/admin/usuarios');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if ('code' in error && error.code as string === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        return {
          ok: false,
          message: `¡ El campo "${fieldError}", está duplicado !`,
          user: null,
        };
      }

      return {
        ok: false,
        message: '¡ Error al crear el usuario, revise los logs del servidor !',
        user: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      user: null,
    };
  }
};
