'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage, deleteImage } from "@/shared/actions";
import { editTeamSchema } from '@/root/src/shared/schemas';
import { Team } from '@/shared/interfaces';

type Options = {
  formData: FormData;
  teamId: string;
  userRoles: string[];
  authenticatedUserId: string;
};

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  team: Team | null;
}>;

export const updateTeamAction = async ({
  formData,
  teamId,
  userRoles,
  authenticatedUserId,
}: Options): EditResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      team: null,
    };
  }

  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      team: null,
    };
  }

  const rawData = {
    name: formData.get('name') as string,
    permalink: formData.get('permalink') ?? '',
    headquarters: formData.get('headquarters') as string,
    division: formData.get('division') ?? '',
    group: formData.get('group') as string,
    tournament: formData.get('tournament') as string,
    country: formData.get('country') as string,
    state: formData.get('state') as string,
    city: formData.get('city') as string,
    coach: formData.get('coach') as string,
    emails: JSON.parse(formData.get('emails') as string),
    address: formData.get('address') as string,
    image: formData.get('image'),
    active: (formData.get('active') === 'true')
      ? true
      : (formData.get('active') === 'false')
        ? false
        : false,
  };

  const teamVerified = editTeamSchema.safeParse(rawData);

  if (!teamVerified.success) {
    return {
      ok: false,
      message: teamVerified.error.message,
      team: null,
    };
  }

  const { image, ...teamToSave } = teamVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const isTeamExists = await transaction.team.count({
          where: { id: teamId },
        });

        if (!isTeamExists) {
          return {
            ok: false,
            message: '¡ El equipo no existe o ha sido eliminado !',
            team: null,
          };
        }

        const updatedTeam = await transaction.team.update({
          where: { id: teamId },
          data: teamToSave,
        });

        if (image !== null) {
          // Delete previous image from cloudinary.
          if (updatedTeam.imagePublicID) {
            const cloudinaryResponse = await deleteImage(updatedTeam.imagePublicID);
            if (!cloudinaryResponse.ok) {
              throw new Error('¡ Error al intentar eliminar la imagen de cloudinary !');
            }
          }

          // Upload Image to third-party storage (cloudinary).
          const imageUploaded = await uploadImage(image as File, 'teams');

          if (!imageUploaded) {
            throw new Error('¡ Error al intentar subir la imagen a cloudinary !');
          }

          // Update image data to database.
          await transaction.team.update({
            where: { id: teamId },
            data: {
              imageUrl: imageUploaded.secureUrl,
              imagePublicID: imageUploaded.publicId,
            },
          });

          // Update event object to return.
          updatedTeam.imageUrl = imageUploaded.secureUrl;
          updatedTeam.imagePublicID = imageUploaded.publicId;
        }

        // Revalidate Cache
        revalidatePath('/admin/equipos');

        return {
          ok: true,
          message: '¡ El equipo fue actualizado correctamente 👍 !',
          team: updatedTeam,
        };
      } catch (error) {
        if (error instanceof Error && 'meta' in error && error.meta) {
          if ('code' in error && error.code as string === 'P2002') {
            const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
            return {
              ok: false,
              message: `¡ El campo "${fieldError}", está duplicado !`,
              team: null,
            };
          }

          return {
            ok: false,
            message: '¡ Error al actualizar el equipo, revise los logs del servidor !',
            team: null,
          };
        }
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs !',
          team: null,
        };
      }
    });

    return prismaTransaction;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      team: null,
    };
  }
};
