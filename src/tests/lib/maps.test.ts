import { getFieldMapEmbedUrl, getMapEmbedUrl, resolveFieldMaps } from '@/lib/maps';

const SHORT_LINK = 'https://maps.app.goo.gl/5NAUcWxGjGWVJiRW6';

const RESOLVED_URL =
  'https://www.google.com/maps/place/It+Innovation+School/@20.7809289,-103.5170294,12z/data=!4m7!3m6!1s0x0:0x0!8m2!3d20.7072939!4d-103.4488931';

const EXPECTED_EMBED_URL =
  'https://www.google.com/maps?q=20.7072939,-103.4488931&z=16&output=embed';

describe('Tests on maps lib', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('getMapEmbedUrl', () => {
    test('Should resolve a short link into an embeddable URL', async () => {
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, url: RESOLVED_URL });
      vi.stubGlobal('fetch', fetchMock);

      await expect(getMapEmbedUrl(SHORT_LINK)).resolves.toBe(EXPECTED_EMBED_URL);
      expect(fetchMock).toHaveBeenCalledWith(
        SHORT_LINK,
        expect.objectContaining({ redirect: 'follow' }),
      );
    });

    test('Should prefer the place marker over the viewport center', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, url: RESOLVED_URL }));

      await expect(getMapEmbedUrl(SHORT_LINK)).resolves.toBe(EXPECTED_EMBED_URL);
    });

    test('Should return an embed URL untouched without fetching', async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);

      const embedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12';

      await expect(getMapEmbedUrl(embedUrl)).resolves.toBe(embedUrl);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    test('Should resolve a link that only has a q query', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          url: 'https://maps.google.com/?q=20.7072939,-103.4488931',
        }),
      );

      await expect(getMapEmbedUrl('https://maps.google.com/?q=20.7072939,-103.4488931'))
        .resolves.toBe(EXPECTED_EMBED_URL);
    });

    test('Should return null for an empty link', async () => {
      await expect(getMapEmbedUrl('')).resolves.toBeNull();
      await expect(getMapEmbedUrl(null)).resolves.toBeNull();
      await expect(getMapEmbedUrl(undefined)).resolves.toBeNull();
    });

    test('Should not fetch a link that is not from Google Maps', async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);

      await expect(getMapEmbedUrl('https://example.com/map')).resolves.toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    test('Should return null when the response is not ok', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, url: RESOLVED_URL }));

      await expect(getMapEmbedUrl(SHORT_LINK)).resolves.toBeNull();
    });

    test('Should return null when the final URL has no coordinates', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ ok: true, url: 'https://consent.google.com/' }),
      );

      await expect(getMapEmbedUrl(SHORT_LINK)).resolves.toBeNull();
    });

    test('Should return null when the fetch fails', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));

      await expect(getMapEmbedUrl(SHORT_LINK)).resolves.toBeNull();
    });
  });

  describe('getFieldMapEmbedUrl', () => {
    test('Should build an embed URL from the place data', () => {
      expect(getFieldMapEmbedUrl({
        name: 'Cancha Norte',
        address: 'Av. Siempre Viva 123',
        city: 'Guadalajara',
        state: null,
        country: 'México',
      })).toBe(
        'https://www.google.com/maps?q=Cancha%20Norte%2C%20Av.%20Siempre%20Viva%20123%2C%20Guadalajara%2C%20M%C3%A9xico&z=16&output=embed',
      );
    });

    test('Should ignore empty values', () => {
      expect(getFieldMapEmbedUrl({
        name: 'Cancha Norte',
        address: '',
        city: '   ',
        state: null,
      })).toBe(
        'https://www.google.com/maps?q=Cancha%20Norte&z=16&output=embed',
      );
    });

    test('Should return null when there is nothing to search for', () => {
      expect(getFieldMapEmbedUrl({ name: '   ', address: '' })).toBeNull();
    });
  });

  describe('resolveFieldMaps', () => {
    const LINK_A = 'https://maps.app.goo.gl/link-a';
    const LINK_B = 'https://maps.app.goo.gl/link-b';
    const URL_A =
      'https://www.google.com/maps/place/A/@20.1,-103.1,12z/data=!8m2!3d20.11!4d-103.11';
    const URL_B =
      'https://www.google.com/maps/place/B/@20.2,-103.2,12z/data=!8m2!3d20.21!4d-103.21';

    test('Should skip empty maps and keep the field order', async () => {
      const fetchMock = vi.fn().mockImplementation((url: string) =>
        Promise.resolve({ ok: true, url: url === LINK_A ? URL_A : URL_B }));
      vi.stubGlobal('fetch', fetchMock);

      const maps = await resolveFieldMaps([
        { id: '1', name: 'Cancha A', map: '' },
        { id: '2', name: 'Cancha B', map: LINK_A },
        { id: '3', name: 'Cancha C', map: '   ' },
        { id: '4', name: 'Cancha D', map: null },
        { id: '5', name: 'Cancha E', map: LINK_B },
      ]);

      expect(maps.map((map) => map.id)).toEqual(['2', '5']);
      expect(maps[0].embedUrl).toBe(
        'https://www.google.com/maps?q=20.11,-103.11&z=16&output=embed',
      );
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    test('Should keep the original link for the fallback anchor', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, url: URL_A }));

      const [map] = await resolveFieldMaps([
        { id: '1', name: 'Cancha A', map: LINK_A },
      ]);

      expect(map.link).toBe(LINK_A);
    });

    test('Should use the field location before the fallback one', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));

      const [map] = await resolveFieldMaps(
        [{
          id: '1',
          name: 'Cancha Norte',
          map: LINK_A,
          city: 'Guadalajara',
        }],
        { city: 'Monterrey' },
      );

      expect(map.embedUrl).toBe(
        `https://www.google.com/maps?q=${encodeURIComponent('Cancha Norte, Guadalajara')}&z=16&output=embed`,
      );
    });

    test('Should use the fallback location when the field has none', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));

      const [map] = await resolveFieldMaps(
        [{ id: '1', name: 'Cancha Norte', map: LINK_A }],
        {
          address: 'Av. Siempre Viva 123',
          city: 'Guadalajara',
          state: 'Jalisco',
          country: 'México',
        },
      );

      expect(map.embedUrl).toBe(
        `https://www.google.com/maps?q=${encodeURIComponent('Cancha Norte, Av. Siempre Viva 123, Guadalajara, Jalisco, México')}&z=16&output=embed`,
      );
    });

    test('Should return an empty list when no field has a map', async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);

      await expect(resolveFieldMaps([
        { id: '1', name: 'Cancha A', map: '' },
        { id: '2', name: 'Cancha B' },
      ])).resolves.toEqual([]);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
