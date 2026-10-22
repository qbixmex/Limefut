import type { FC } from 'react';

type Props = Readonly<{
  link: string;
  embedUrl?: string | null;
  title?: string;
}>;

export const FieldMap: FC<Props> = ({
  link,
  embedUrl,
  title = 'Ubicación de la cancha',
}) => {
  if (!embedUrl) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sky-500 underline"
      >
        Ver ubicación en Google Maps
      </a>
    );
  }

  return (
    <iframe
      src={embedUrl}
      title={title}
      width="100%"
      height={500}
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      className="border border-slate-800 dark:border-slate-400 rounded-sm"
    />
  );
};
