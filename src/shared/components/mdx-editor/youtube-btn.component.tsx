import { usePublisher, insertDirective$, DialogButton } from '@mdxeditor/editor';
import { FaYoutube as Youtube } from 'react-icons/fa6';
import type { LeafDirective } from 'mdast-util-directive';

const extractYouTubeId = (input: string) => {
  try {
    const u = new URL(input, window.location.href);
    const host = u.hostname.replace('www.', '');
    // short youtu.be links
    if (host === 'youtu.be') return u.pathname.split('/').filter(Boolean).pop() ?? null;
    // youtube domain
    if (host.includes('youtube')) {
      const v = u.searchParams.get('v');
      if (v) return v;
      // /embed/ID or /v/ID or /watch/... fallback
      const parts = u.pathname.split('/').filter(Boolean);
      return parts.pop() ?? null;
    }
  } catch {
    return null;
  }
  return null;
};

export const YouTubeButton = () => {
  const insertDirective = usePublisher(insertDirective$);

  return (
    <DialogButton
      tooltipTitle="Insert Youtube video"
      submitButtonTitle="Insert video"
      dialogInputPlaceholder="Pega la URL de YouTube"
      buttonContent={<Youtube />}
      onSubmit={(url) => {
        const id = extractYouTubeId(String(url || ''));
        if (id) {
          insertDirective({
            name: 'youtube',
            type: 'leafDirective',
            attributes: { id },
            children: [],
          } as unknown as LeafDirective);
        } else {
          alert('URL de YouTube inválida');
        }
      }}
    />
  );
};

export default YouTubeButton;

