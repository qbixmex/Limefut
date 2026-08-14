import type { FC } from 'react';

type Props = Readonly<{ googleTagManagerId?: string | null; }>;

export const DynamicGoogleTagManagerBody: FC<Props> = ({ googleTagManagerId }) => {
  if (!googleTagManagerId) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
};
