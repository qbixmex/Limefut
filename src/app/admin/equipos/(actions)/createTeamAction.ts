'use server';

import prisma from "@/lib/prisma";
import { createTeamSchema } from "@/shared/schemas";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/shared/actions";

export const createTeamAction = async (
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
    image: formData.get('image') as File,

    isActive: (formData.get('active') === 'true')
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
      user: null,
    };
  }

  const { image, ...teamToSave } = teamVerified.data;

  // Upload Image to third-party storage (cloudinary).
  const cloudinaryResponse = await uploadImage(image!, 'teams');

  if (!cloudinaryResponse) {
    throw new Error('Error uploading image to cloudinary');
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdTeam = await transaction.team.create({
        data: {
          name: teamToSave.name,
          permalink: teamToSave.permalink,
          headquarters: teamToSave.headquarters,
          division: teamToSave.division,
          group: teamToSave.group,
          tournament: teamToSave.tournament,
          country: teamToSave.country,
          state: teamToSave.state,
          city: teamToSave.city,
          coach: teamToSave.coach,
          emails: teamToSave.emails,
          address: teamToSave.address,
          imageUrl: cloudinaryResponse.secureUrl,
          imagePublicID: cloudinaryResponse.publicId,
          active: teamToSave.active,
        }
      });

      return {
        ok: true,
        message: '¡ Equipo creado satisfactoriamente 👍 !',
        user: {
          headquarters: createdTeam.headquarters,
          division: createdTeam.division,
          group: createdTeam.group,
          tournament: createdTeam.tournament,
          country: createdTeam.country,
          state: createdTeam.state,
          city: createdTeam.city,
          coach: createdTeam.coach,
          emails: createdTeam.emails,
          address: createdTeam.address,
          imageUrl: createdTeam.imageUrl,
          imagePublicID: createdTeam.imagePublicID,
          active: teamToSave.active,
        },
      };
    });

    // Revalidate Paths
    revalidatePath('/admin/equipos');

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
        message: '¡ Error al crear el equipo, revise los logs del servidor !',
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
