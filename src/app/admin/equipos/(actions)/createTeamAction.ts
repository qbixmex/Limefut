'use server';

import prisma from '@/lib/prisma';
import { createTeamSchema } from '@/shared/schemas';
import { updateTag } from 'next/cache';
import { uploadImage } from '@/shared/actions';
import type { CloudinaryResponse } from '@/shared/interfaces';
import type { GENDER_TYPE } from '@/shared/enums';
import type { Prisma } from '@/generated/prisma/client';

type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  team: Team & {
    tournament: {
      permalink: string;
    } | null;
  } | null;
}>;

type Team = {
  id: string;
  name: string;
  imageUrl: string | null;
  state: string | null;
  address: string | null;
  permalink: string;
  imagePublicID: string | null;
  format: string;
  gender: string;
  country: string | null;
  city: string | null;
  active: boolean;
  coachId: string | null;
  emails: string[];
  createdAt: Date;
  updatedAt: Date;
  tournament: {
    name: string;
    permalink: string;
  } | null;
  category: {
    name: string;
    permalink: string;
  } | null;
};

export const createTeamAction = async (
  formData: FormData,
  userRole: string[] | null,
): ResponseAction => {
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
    categoryId: formData.get('categoryId') ?? null,
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
    fieldsIds: formData.has('fieldsIds')
      ? JSON.parse(formData.get('fieldsIds') as string ?? 'undefined')
      : undefined,
    active: (formData.get('active') === 'true')
      ? true
      // eslint-disable-next-line no-unneeded-ternary
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
      const teamSelect = {
        id: true,
        name: true,
        permalink: true,
        format: true,
        gender: true,
        country: true,
        state: true,
        city: true,
        coachId: true,
        emails: true,
        address: true,
        active: true,
        imageUrl: true,
        imagePublicID: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            name: true,
            permalink: true,
          },
        },
        tournament: {
          select: {
            name: true,
            permalink: true,
          },
        },
      } satisfies Prisma.TeamSelect;

      const createdTeam = await transaction.team.create({
        data: {
          name: teamToSave.name,
          permalink: teamToSave.permalink,
          imageUrl: cloudinaryResponse?.secureUrl ?? undefined,
          imagePublicID: cloudinaryResponse?.publicId ?? undefined,
          categoryId: teamToSave.categoryId,
          format: teamToSave.format,
          gender: teamToSave.gender as GENDER_TYPE,
          country: teamToSave.country,
          city: teamToSave.city,
          state: teamToSave.state,
          emails: teamToSave.emails,
          address: teamToSave.address,
          active: teamToSave.active,
          tournamentId: teamToSave.tournamentId ?? null,
          coachId: teamToSave.coachId ?? null,
        },
        select: teamSelect,
      });

      // Create TeamField records for the many-to-many relationship
      if (teamToSave.fieldsIds && teamToSave.fieldsIds.length > 0) {
        await transaction.teamField.createMany({
          data: teamToSave.fieldsIds.map((fieldId) => ({
            teamId: createdTeam.id,
            fieldId,
          })),
        });
      }

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
    updateTag('admin-teams-for-gallery');
    updateTag('admin-teams-for-match');
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
