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
      redirect: 'follow',
    });

    const html = await response.text();

    // Extraer og:url (URL real del reel)
    const match = html.match(/<meta\s+property="og:url"\s+content="([^"]+)"/);

    if (match?.[1]) {
      const realUrl = match[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      return Response.json({ realUrl });
    }

    return Response.json(
      { error: 'Could not resolve URL' },
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
