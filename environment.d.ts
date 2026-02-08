declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DOMAIN: string | null;
      BETTER_AUTH_SECRET: string | null;
      AUTH_TRUST_HOST: string | null;
      AUTH_GOOGLE_ID: string | null;
      AUTH_GOOGLE_SECRET: string | null;
      AUTH_GITHUB_ID: string | null;
      AUTH_GITHUB_SECRET: string | null;
      NEXT_PUBLIC_GA_ID: string | null;
      NEXT_PUBLIC_SITE_URL: string | null;
      DATABASE_URL: string | null;
      DB_USER: string | null;
      DB_PASSWORD: string | null;
      DB_NAME: string | null;
      FACEBOOK_APP_ID: string | null;
      MAILER_SERVICE: string | null;
      MAILER_EMAIL: string | null;
      MAILER_TO: string | null;
      MAILERS_TO: string | null;
      MAILER_SECRET_KEY: string | null;
    }
  }
}

export {};