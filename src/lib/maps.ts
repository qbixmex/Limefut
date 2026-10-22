const EMBED_URL_PATTERN = /\/maps\/embed/;
const PLACE_COORDINATES_PATTERN = /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/;
const QUERY_COORDINATES_PATTERN = /[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/;
const CENTER_COORDINATES_PATTERN = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/;

const GOOGLE_MAPS_HOST_PATTERN = /(^|\.)(google\.[a-z]{2,3}(\.[a-z]{2,3})?|goo\.gl)$/i;

/** 30 days: Google is contacted once per field, not once per page view. */
const MAP_LINK_REVALIDATE = 60 * 60 * 24 * 30;
const DEFAULT_ZOOM = 16;

type Coordinates = readonly [latitude: string, longitude: string];

export type FieldMapSource = Readonly<{
  id: string;
  name: string;
  map?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}>;

export type MapLocationFallback = Readonly<{
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}>;

export type ResolvedFieldMap = Readonly<{
  id: string;
  name: string;
  link: string;
  embedUrl: string | null;
}>;

type MapPlace = Readonly<{ name: string }> & MapLocationFallback;

const toEmbedUrl = ([latitude, longitude]: Coordinates, zoom = DEFAULT_ZOOM) =>
  `https://www.google.com/maps?q=${latitude},${longitude}&z=${zoom}&output=embed`;

const isGoogleMapsLink = (link: string): boolean => {
  try {
    return GOOGLE_MAPS_HOST_PATTERN.test(new URL(link).hostname);
  } catch {
    return false;
  }
};

/**
 * Returns the coordinates of a Google Maps URL.
 * The `!3d/!4d` pair is the real place marker, while `@lat,lng` is only
 * the viewport center, so the place marker is always preferred.
 */
const parseCoordinates = (url: string): Coordinates | null => {
  const patterns = [
    PLACE_COORDINATES_PATTERN,
    QUERY_COORDINATES_PATTERN,
    CENTER_COORDINATES_PATTERN,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);

    if (match) return [match[1], match[2]];
  }

  return null;
};

/**
 * Turns any Google Maps link (short share link or full place URL) into a URL
 * that is allowed inside an iframe.
 *
 * `maps.app.goo.gl/...` resolves to the normal Maps page, which sends
 * `X-Frame-Options: SAMEORIGIN`. Only `/maps/embed` and `...&output=embed`
 * can be framed.
 */
export const getMapEmbedUrl = async (
  link?: string | null,
): Promise<string | null> => {
  if (!link?.trim()) return null;

  const trimmedLink = link.trim();

  // Already an embed URL, use it as is.
  if (EMBED_URL_PATTERN.test(trimmedLink)) return trimmedLink;

  // Never fetch anything that is not a Google Maps URL.
  if (!isGoogleMapsLink(trimmedLink)) return null;

  try {
    const response = await fetch(trimmedLink, {
      redirect: 'follow',
      next: { revalidate: MAP_LINK_REVALIDATE },
    });

    if (!response.ok) return null;

    // `response.url` is the final URL after the short link redirect.
    const coordinates = parseCoordinates(response.url);

    if (!coordinates) return null;

    return toEmbedUrl(coordinates);
  } catch (error) {
    console.error('Error resolving the map link:', error);

    return null;
  }
};

/**
 * Network free fallback: finds the place by its name and address.
 * Used when the share link cannot be resolved (Google throttling,
 * consent pages, invalid links, etc.).
 */
export const getFieldMapEmbedUrl = (place: MapPlace): string | null => {
  const query = [
    place.name,
    place.address,
    place.city,
    place.state,
    place.country,
  ]
    .filter((value): value is string => Boolean(value?.trim()))
    .map((value) => value.trim())
    .join(', ');

  if (!query) return null;

  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${DEFAULT_ZOOM}&output=embed`;
};

/**
 * Resolves the map of every field that has one, ignoring empty values.
 * Each map is resolved with its own link and, when that fails, with the
 * place name/address as a fallback.
 */
export const resolveFieldMaps = async (
  fields: readonly FieldMapSource[],
  fallback?: MapLocationFallback,
): Promise<ResolvedFieldMap[]> =>
  Promise.all(
    fields
      .filter((field): field is FieldMapSource & { map: string } => Boolean(field.map?.trim()))
      .map(async (field) => ({
        id: field.id,
        name: field.name,
        link: field.map,
        embedUrl:
          (await getMapEmbedUrl(field.map)) ??
          getFieldMapEmbedUrl({
            name: field.name,
            address: field.address ?? fallback?.address,
            city: field.city ?? fallback?.city,
            state: field.state ?? fallback?.state,
            country: field.country ?? fallback?.country,
          }),
      })),
  );
