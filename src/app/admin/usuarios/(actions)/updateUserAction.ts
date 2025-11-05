'use server';

import prisma from '@/lib/prisma';
import type { User } from "@/root/next-auth";
import type { Role } from '@/root/src/shared/interfaces';
import { editUserSchema } from "@/root/src/shared/schemas";
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { uploadImage, deleteImage } from '@/shared/actions';

type Options = {
  formData: FormData;
  userId: string;
  userRoles: string[];
  authenticatedUserId: string;
};

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  user: User | null;
}>;

export const updateUserAction = async ({
  formData,
  userId,
  userRoles,
  authenticatedUserId,
}: Options): EditResponseAction => {
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
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      user: null,
    };
  }

  const imageFile = formData.get('image');

  const rawData = {
    name: formData.get('name') ?? '',
    username: formData.get('username') ?? '',
    email: formData.get('email') ?? '',
    image: (imageFile instanceof File && imageFile.size > 0)
      ? imageFile
      : null,
    password: formData.get('password') ?? '',
    passwordConfirmation: formData.get('passwordConfirmation') ?? '',
    roles: formData.get('roles')
      ? JSON.parse(formData.get('roles') as string)
      : [],
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

  const { image, ...userToSave } = userVerified.data;

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

        let hashedPassword: string | undefined = undefined;

        if (userToSave.password && userToSave.password.trim().length > 0) {
          hashedPassword = userVerified.data.password ?
            bcrypt.hashSync(userVerified.data.password, 10)
            : undefined;
        }

        const updatedUser = await transaction.user.update({
          where: { id: userId },
          data: {
            name: userToSave.name as string,
            username: userToSave.username,
            email: userToSave.email as string,
            roles: userToSave.roles as Role[],
            isActive: userToSave.isActive as boolean,
            password: hashedPassword,
          },
        });

        if (image) {
          // Delete previous image from cloudinary.
          if (updatedUser.imagePublicID) {
            const cloudinaryResponse = await deleteImage(updatedUser.imagePublicID);
            if (!cloudinaryResponse.ok) {
              throw new Error('¡ Error al intentar eliminar la imagen de cloudinary !');
            }
          }

          // Upload Image to third-party storage (cloudinary).
          const imageUploaded = await uploadImage(image, 'users');

          if (!imageUploaded) {
            throw new Error('¡ Error al intentar subir la imagen a cloudinary !');
          }

          // Update image data to database.
          await transaction.user.update({
            where: { id: userId },
            data: {
              imageUrl: imageUploaded.secureUrl,
              imagePublicID: imageUploaded.publicId,
            },
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              imageUrl: true,
              imagePublicID: true,
              roles: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
            },
          });

          // Update event object to return.
          updatedUser.imageUrl = imageUploaded.secureUrl;
        }

        // Revalidate Cache
        revalidatePath('/admin/usuarios');
        
        return {
          ok: true,
          message: '¡ Usuario actualizado satisfactoriamente 👍 !',
          user: updatedUser,
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
