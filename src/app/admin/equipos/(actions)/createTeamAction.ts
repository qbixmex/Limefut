'use server';

import prisma from "@/lib/prisma";
import { createTeamSchema } from "@/shared/schemas";
import { updateTag } from "next/cache";
import { uploadImage } from "@/shared/actions";
import type { CloudinaryResponse, Team } from "@/shared/interfaces";

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  team: Team | null;
}>;

export const createTeamAction = async (
  formData: FormData,
  userRole: string[] | null,
): CreateResponseAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
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
    category: formData.get('category') ?? '',
    format: formData.get('format') as string,
    gender: formData.get('gender') as string,
    tournamentId: formData.get('tournamentId') ?? null,
    country: formData.get('country') as string,
    state: formData.get('state') as string,
    city: formData.get('city') as string,
    coachId: formData.get('coachId') as string,
    emails: JSON.parse(formData.get('emails') as string),
    address: formData.get('address') as string,
    image: formData.get('image') as File,
    active: (formData.get('active') === 'true')
      ? true
      : (formData.get('active') === 'false')
        ? false
        : false,
  };

  const teamVerified = createTeamSchema.safeParse(rawData);

  if (!teamVerified.success) {
    return {
      ok: false,
      message: teamVerified.error.message,
      team: null,
    };
  }

  const { image, ...teamToSave } = teamVerified.data;

  // Upload Image to third-party storage (cloudinary).
  let cloudinaryResponse: CloudinaryResponse | null = null;

  if (image) {
    cloudinaryResponse = await uploadImage(image!, 'teams');
    if (!cloudinaryResponse) {
      throw new Error('Error subiendo imagen a cloudinary');
    }
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdTeam = await transaction.team.create({
        data: {
          name: teamToSave.name,
          permalink: teamToSave.permalink,
          headquarters: teamToSave.headquarters,
          imageUrl: cloudinaryResponse?.secureUrl ?? undefined,
          imagePublicID: cloudinaryResponse?.publicId ?? undefined,
          category: teamToSave.category,
          format: teamToSave.format,
          gender: teamToSave.gender,
          country: teamToSave.country,
          city: teamToSave.city,
          state: teamToSave.state,
          emails: teamToSave.emails,
          address: teamToSave.address,
          active: teamToSave.active,
          tournamentId: teamToSave.tournamentId ?? null,
          coachId: teamToSave.coachId ?? null,
        },
      });

      return {
        ok: true,
        message: '¡ Equipo creado satisfactoriamente 👍 !',
        team: createdTeam,
      };
    });

    // Update Cache
    updateTag('admin-teams');
    updateTag('admin-teams-for-player');
    updateTag('admin-teams-for-coach');
    updateTag("admin-teams-for-gallery");
    updateTag('admin-team');
    updateTag('public-teams');
    updateTag('public-team');
    updateTag('standings');

    return prismaTransaction;
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
        message: '¡ Error al crear el equipo, revise los logs del servidor !',
        team: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      team: null,
    };
  }
};
