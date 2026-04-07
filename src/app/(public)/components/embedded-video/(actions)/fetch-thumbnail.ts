type ResponseType = Promise<{
  data: { thumbnailUrl: string; };
}>;

export const fetchThumbnail = async (url: string): ResponseType => {
  const response = await fetch('/api/facebook-thumbnail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  const { data } = await response.json();

  // UNCOMMENT FOR DEBUGGING
  // console.log(data);

  return data;
};
