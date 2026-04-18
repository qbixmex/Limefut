import z from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 2; // 2MB
const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

export const GlobalSettingsSchema = z.object({
  // GENERAL
  siteName: z.union([
    z.literal(''),
    z.string('El nombre del sitio deber ser una cadena de texto')
      .min(3, { message: 'El nombre del sitio debe ser mayor a 3 caracteres' })
      .max(100, { message: 'El nombre del sitio debe ser menor a 100 caracteres' }),
  ]).optional(),
  logoImage: z
    .instanceof(File, { message: 'La imagen debe ser un archivo' })
    .refine((file) => { return !file || file.size <= MAX_UPLOAD_SIZE; }, 'El tamaño máximo del logo deber ser menor a 2MB')
    .refine((file) => { return file && ACCEPTED_FILE_TYPES.includes(file.type); }, 'El tipo de archivo debe ser uno de los siguientes: png, jpeg, jpg, gif, webp')
    .optional(),
  logoAdminImage: z
    .instanceof(File, { message: 'La imagen debe ser un archivo' })
    .refine((file) => { return !file || file.size <= MAX_UPLOAD_SIZE; }, 'El tamaño máximo del logo deber ser menor a 2MB')
    .refine((file) => { return file && ACCEPTED_FILE_TYPES.includes(file.type); }, 'El tipo de archivo debe ser uno de los siguientes: png, jpeg, jpg, gif, webp')
    .optional(),
  faviconImage: z
    .instanceof(File, { message: 'La imagen favicon debe ser un archivo' })
    .refine((file) => { return !file || file.size <= ((1024 * 1024) * 1); }, 'El tamaño máximo del favicon deber ser menor a 1MB')
    .refine((file) => { return file && ACCEPTED_FILE_TYPES.includes(file.type); }, 'El tipo de archivo debe ser uno de los siguientes: png, jpeg, jpg, gif, webp')
    .optional(),
  organizationName: z.union([
    z.literal(''),
    z.string({ error: 'El nombre de la organización debe ser una cadena de texto' })
      .min(3, { error: 'El nombre de la organización debe ser mayor a 3 caracteres' })
      .max(100, { error: 'El nombre de la organización debe ser menor a 100 caracteres' }),
  ]).optional(),
  phone: z.union([
    z.literal(''),
    z.string({ error: 'El teléfono debe ser una cadena de texto' })
      .min(8, { error: 'El teléfono debe ser mayor a 8 caracteres' })
      .max(150, { error: 'El teléfono debe ser menor a 150 caracteres' }),
  ]).optional(),
  address: z.union([
    z.literal(''),
    z.string({ error: 'El dirección debe ser una cadena de texto' })
      .min(4, { error: 'La dirección debe ser mayor a 4 caracteres' })
      .max(255, { error: 'La dirección debe ser menor a 255 caracteres' }),
  ]).optional(),
  mapsUrl: z.union([
    z.literal(''),
    z.url({
      protocol: /^https?$/,
      error: 'El url del mapa debe comenzar con https://',
    }),
  ]).optional(),
  country: z.union([
    z.literal(''),
    z.string({ error: 'El país debe ser una cadena de texto' })
      .min(3, { error: 'El país debe ser mayor a 3 caracteres' })
      .max(50, { error: 'El país debe ser menor a 50 caracteres' }),
  ]).optional(),

  // SOCIAL MEDIA
  facebookUrl: z.union([
    z.literal(''),
    z.url({
      protocol: /^https?$/,
      error: 'El url de Facebook debe comenzar con https://',
    }),
  ]).optional(),
  twitterXUrl: z.union([
    z.literal(''),
    z.url({
      protocol: /^https?$/,
      error: 'El url de Twitter X debe comenzar con https://',
    }),
  ]).optional(),
  instagramUrl: z.union([
    z.literal(''),
    z.url({
      protocol: /^https?$/,
      error: 'El url de Instagram debe comenzar con https://',
    }),
  ]).optional(),
  youtubeUrl: z.union([
    z.literal(''),
    z.url({
      protocol: /^https?$/,
      error: 'El url de Youtube debe comenzar con https://',
    }),
  ]).optional(),
  tiktokUrl: z.union([
    z.literal(''),
    z.url({
      protocol: /^https?$/,
      error: 'El url de TikTok debe comenzar con https://',
    }),
  ]).optional(),
  whatsApp: z.union([
    z.literal(''),
    z.string({ error: 'El WhatsApp debe ser una cadena de texto' })
      .min(8, { error: 'El WhatsApp debe ser mayor a 8 caracteres' })
      .max(100, { error: 'El WhatsApp debe ser menor a 100 caracteres' }),
  ]).optional(),

  // MAINTENANCE MODE
  maintenanceMode: z
    .boolean({ error: 'El modo de mantenimiento debe ser un valor boleano' })
    .optional(),
  maintenanceMessage: z.union([
    z.literal(''),
    z.string({ error: 'El mensaje de mantenimiento debe ser una cadena de texto' })
      .min(4, { error: 'El mensaje de mantenimiento debe ser mayor a 4 caracteres' })
      .max(255, { error: 'El mensaje de mantenimiento debe ser menor a 255 caracteres' }),
  ]).optional(),

  // COLORS
  primaryColor: z.union([
    z.literal(''),
    z.string({ error: 'El color primario debe ser una cadena de texto' })
      .min(4, { error: 'El color primario debe ser mayor a 4 caracteres' })
      .max(50, { error: 'El color primario debe ser menor a 50 caracteres' }),
  ]).optional(),
  secondaryColor: z.union([
    z.literal(''),
    z.string({ error: 'El color secundario debe ser una cadena de texto' })
      .min(4, { error: 'El color secundario debe ser mayor a 4 caracteres' })
      .max(50, { error: 'El color secundario debe ser menor a 50 caracteres' }),
  ]).optional(),
  accentColor: z.union([
    z.literal(''),
    z.string({ error: 'El color de acento debe ser una cadena de texto' })
      .min(4, { error: 'El color de acento debe ser mayor a 4 caracteres' })
      .max(50, { error: 'El color de acento debe ser menor a 50 caracteres' }),
  ]).optional(),

  // ANALYTICS
  googleAnalyticsId: z.union([
    z.literal(''),
    z.string({ error: 'El id de Google Analytics debe ser una cadena de texto' })
      .max(255, { error: 'El id de Google Analytics debe ser menor a 255 caracteres' }),
  ]).optional(),
  googleTagManager: z.union([
    z.literal(''),
    z.string({ error: 'El id de Google Tag Manager debe ser una cadena de texto' })
      .max(255, { error: 'El id de Google Tag Manager debe ser menor a 255 caracteres' }),
  ]).optional(),
  metaPixelId: z.union([
    z.literal(''),
    z.string({ error: 'El id de Meta Pixel debe ser una cadena de texto' })
      .max(255, { error: 'El id de Meta Pixel debe ser menor a 255 caracteres' }),
  ]).optional(),

  // LOCATION
  defaultLanguage: z.union([
    z.literal(''),
    z.string({ error: 'El idioma por defecto debe ser una cadena de texto' })
      .max(4, { error: 'El idioma por defecto debe ser menor a 4 caracteres' }),
  ]).optional(),
  timeZone: z.union([
    z.literal(''),
    z.string({ error: 'La zona horaria debe ser una cadena de texto' })
      .min(1, { error: 'La zona horaria es obligatoria' })
      .max(100, { error: 'La zona horaria debe ser menor a 100 caracteres' }),
  ]).optional(),

  // EMAIL
  contactEmail: z.union([
    z.literal(''),
    z.email('El correo de contacto es incorrecto'),
  ]).optional(),
  fromEmail: z.union([
    z.literal(''),
    z.email('El correo del remitente es incorrecto'),
  ]).optional(),
  replyToEmail: z.union([
    z.literal(''),
    z.email('El correo del destinatario es incorrecto'),
  ]).optional(),
});

export const SeoSectionSchema = z.object({
  permalink: z
    .string({ error: 'El enlace permanente del seo debe ser una cadena de texto' })
    .optional(),
  title: z
    .string({ error: 'El título seo debe ser una cadena de texto' })
    .min(8, { error: 'El título seo debe ser mayor a 8 caracteres' })
    .max(70, { error: 'El título seo debe ser menor a 70 caracteres' })
    .optional(),
  description: z
    .string({ error: 'La descripción seo debe ser una cadena de texto' })
    .min(8, { error: 'La descripción seo debe ser mayor a 8 caracteres' })
    .max(165, { error: 'La descripción seo debe ser menor a 165 caracteres' })
    .optional(),
  robots: z.array(z.string()).optional(),
});
