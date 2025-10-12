'use server';

import prisma from '@/lib/prisma';
import { User } from "@/root/next-auth";
import { Role } from '@/root/src/shared/interfaces';
import { editUserSchema } from "@/root/src/shared/schemas";
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

type Options = {
  formData: FormData;
  userId: string;
  userRoles: string[];
  authenticatedUserId: string;
};

type EditArticleResponse = Promise<{
  ok: boolean;
  message: string;
  user: User | null;
}>;

export const updateUserAction = async ({
  formData,
  userId,
  userRoles,
  authenticatedUserId,
}: Options): EditArticleResponse => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      user: null,
    };
  }

  if (!userRoles.includes('admin')) {
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
    imageUrl: formData.get('imageUrl') ?? '',
    password: formData.get('password') as string,
    passwordConfirmation: formData.get('passwordConfirmation') as string,
    roles: JSON.parse(formData.get('roles') as string),
    isActive: (formData.get('isActive') === 'true')
      ? true
      : (formData.get('isActive') === 'false')
        ? false
        : false,
  };

  const userVerified = editUserSchema.safeParse(rawData);

  if (!userVerified.success) {
    return {
      ok: false,
      message: userVerified.error.message,
      user: null,
    };
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const isUserExists = await transaction.user.count({
          where: { id: userId },
        });

        if (!isUserExists) {
          return {
            ok: false,
            message: '¡ El usuario no existe o ha sido eliminado !',
            user: null,
          };
        }

        const hashedPassword = userVerified.data.password ?
          bcrypt.hashSync(userVerified.data.password, 10)
          : undefined;

        const updatedUser = await transaction.user.update({
          where: { id: userId },
          data: {
            name: userVerified.data.name,
            username: userVerified.data.username,
            email: userVerified.data.email as string,
            imageUrl: userVerified.data.imageUrl,
            password: hashedPassword,
            roles: userVerified.data.roles as Role[],
            isActive: userVerified.data.isActive,
          },
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            imageUrl: true,
            roles: true,
            isActive: true,
          }
        });

        // TODO Image Handling
        /* 
          if (image) {
            // Delete previous image from cloudinary.
            if (updatedUser.imagePublicID) {
              const cloudinaryResponse = await deleteImage(updatedUser.imagePublicID);
              if (!cloudinaryResponse.ok) {
                throw new Error('Error deleting image from cloudinary');
              }
            }

            // Upload Image to third-party storage (cloudinary).
            const imageUploaded = await uploadImage(image, 'users');

            if (!imageUploaded) {
              throw new Error('Error uploading image to cloudinary');
            }

            // Update user with new image.
            await transaction.user.update({
              where: { id: userId },
              data: {
                imageURL: imageUploaded.secureUrl,
                imagePublicID: imageUploaded.publicId,
              },
            });

            // Update event object to return.
            updatedUser.imageURL = imageUploaded.secureUrl;
          }
        */

        // Revalidate Cache
        revalidatePath('/admin/users');

        return {
          ok: true,
          message: '¡ Usuario actualizado satisfactoriamente 👍 !',
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            imageUrl: updatedUser.imageUrl,
            roles: updatedUser.roles,
            isActive: updatedUser.isActive,
          },
        };
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
            message: '¡ Error al actualizar el usuario, revise los logs del servidor !',
            user: null,
          };
        }
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs !',
          user: null,
        };
      }
    });

    return prismaTransaction;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      user: null,
    };
  }
};
