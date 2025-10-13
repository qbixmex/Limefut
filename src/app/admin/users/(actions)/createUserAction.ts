'use server';

import prisma from "@/lib/prisma";
import { createUserSchema } from "@/shared/schemas";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { uploadImage } from "./uploadImageAction";

export const createUserAction = async (
  formData: FormData,
  userRole: string[] | null,
) => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para solicitar esta petición !',
      user: null,
    };
  }

  const rawData = {
    name: formData.get('name') as string,
    username: formData.get('username') ?? '',
    email: formData.get('email') as string,
    image: formData.get('image') ?? '',
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
  const cloudinaryResponse = await uploadImage(image!, 'users');

  if (!cloudinaryResponse) {
    throw new Error('Error uploading image to cloudinary');
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdUser = await transaction.user.create({
        data: {
          name: userToSave.name,
          username: userToSave.username,
          email: userToSave.email,
          imageUrl: cloudinaryResponse.secureUrl,
          imagePublicID: cloudinaryResponse.publicId,
          password: bcrypt.hashSync(userToSave.password, 10),
          roles: userToSave.roles,
          isActive: userToSave.isActive,
        }
      });

      return {
        ok: true,
        message: '¡ Usuario creado satisfactoriamente 👍 !',
        user: {
          name: createdUser.name,
          username: createdUser.username,
          email: createdUser.email,
          imageUrl: createdUser.imageUrl,
          roles: createdUser.roles,
          isActive: createdUser.isActive,
        },
      };
    });

    // Revalidate Paths
    revalidatePath('/admin/users');

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
