export interface GlobalSettings {
  // GENERAL
  id: number;
  siteName?: string | null;
  organizationName: string | null;
  phone: string | null;
  address: string | null;
  mapsUrl: string | null;
  country: string | null;

  // LOGOS
  logoUrl: string | null;
  logoPublicId: string | null;
  logoAdminUrl: string | null;
  logoAdminPublicId: string | null;
  faviconUrl: string | null;
  favIconPublicId: string | null;

  // SOCIAL MEDIA
  facebookUrl: string | null;
  twitterXUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
  whatsApp: string | null;

  // MAINTENANCE MODE
  maintenanceMode: boolean;
  maintenanceMessage: string | null;

  // ANALYTICS
  googleAnalyticsId: string | null;
  googleTagManager: string | null;
  metaPixelId: string | null;

  // LOCATION
  defaultLanguage: string | null;
  timeZone: string | null;

  // EMAIL
  contactEmail: string | null;
  fromEmail: string | null;
  replyToEmail: string | null;

  // SEO SETTINGS
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  ogImagePublicId: string | null;

  // TIMESTAMPS
  createdAt: Date;
  updatedAt: Date;
}
