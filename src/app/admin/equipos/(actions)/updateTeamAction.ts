'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { uploadImage, deleteImage } from '@/shared/actions';
import { editTeamSchema } from '@/shared/schemas';

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

type Team = {
  id: string;
  name: string;
  imageUrl: string | null;
  state: string | null;
  address: string | null;
  permalink: string;
  imagePublicID: string | null;
  category: string;
  format: string;
  gender: string;
  country: string | null;
  city: string | null;
  active: boolean;
  tournamentId: string | null;
  coachId: string | null;
  emails: string[];
  createdAt: Date;
  updatedAt: Date;
};

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
    category: formData.get('category') ?? '',
    format: formData.get('format') as string,
    gender: formData.get('gender') as string,
    tournamentId: formData.get('tournamentId') ?? null,
    country: formData.get('country') as string ?? null,
    state: formData.get('state') as string ?? null,
    city: formData.get('city') as string ?? null,
    coachId: formData.get('coachId') ?? null,
    emails: JSON.parse(formData.get('emails') as string),
    address: formData.get('address') ?? null,
    image: formData.get('image'),
    fieldsIds: formData.get('fieldsIds')
      ? JSON.parse(formData.get('fieldsIds') as string ?? 'undefined')
      : undefined,
    active: formData.get('active') === 'true',
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
          data: {
            name: teamToSave.name,
            permalink: teamToSave.permalink,
            category: teamToSave.category,
            format: teamToSave.format,
            gender: teamToSave.gender,
            country: teamToSave.country,
            city: teamToSave.city,
            state: teamToSave.state,
            emails: teamToSave.emails,
            address: teamToSave.address ?? undefined,
            active: teamToSave.active,
            tournamentId: teamToSave.tournamentId,
            coachId: teamToSave.coachId ?? undefined,
          },
        });

        // Update TeamField records for the many-to-many relationship
        if (teamToSave.fieldsIds !== undefined) {
          // Delete existing relationships
          await transaction.teamField.deleteMany({
            where: { teamId },
          });

          // Create new relationships if any
          if (teamToSave.fieldsIds.length > 0) {
            await transaction.teamField.createMany({
              data: teamToSave.fieldsIds.map((fieldId) => ({
                teamId,
                fieldId,
              })),
            });
          }
        }

        // Update Image
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

        // Update Cache
        updateTag('admin-teams');
        updateTag('admin-teams-for-coach');
        updateTag('admin-teams-for-player');
        updateTag('admin-teams-for-gallery');
        updateTag('admin-teams-for-match');
        updateTag('admin-team');
        updateTag('public-teams');
        updateTag('public-team');
        updateTag('standings');

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
