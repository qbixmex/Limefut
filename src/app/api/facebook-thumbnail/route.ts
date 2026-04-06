export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return Response.json(
        { error: 'URL is required' },
        { status: 400 },
      );
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return Response.json(
        { error: 'Failed to fetch page' },
        { status: response.status }
      );
    }

    const html = await response.text();

    // Extraer og:image
    const match = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/);

    if (match?.[1]) {
      // Decodificar entidades HTML (&amp; → &, etc)
      const thumbnailUrl = match[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      return Response.json({ thumbnailUrl });
    }

    return Response.json(
      { error: 'No thumbnail found' },
      { status: 404 },
    );
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
