import { Suspense, type FC } from 'react';
import type { Metadata } from 'next/types';
import { fetchPublicAnnouncementAction } from '../../(actions)/announcements/fetchPublicAnnouncement';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeYoutube from '@/lib/rehype-youtube';
import Image from 'next/image';
import './styles.css';

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Ultimas noticias de Limefut',
  robots: 'noindex, nofollow',
};

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>
}>;

export const AnnouncementPage: FC<Props> = ({ params }) => {
  return (
    <div className="wrapper dark:bg-gray-600/20!">
      <Suspense>
        <AnnouncementContent params={params} />
      </Suspense>
    </div>
  );
};

export const AnnouncementContent: FC<Props> = async ({ params }) => {
  const permalink = (await params).permalink;

  const { ok, message, announcement } = await fetchPublicAnnouncementAction(permalink);

  if (!ok && !announcement) {
    return redirect(`${ROUTES.HOME}?error=${encodeURIComponent(message)}`);
  }

  return (
    <>
      <div id="heading">{announcement?.title}</div>

      {announcement && announcement.imageUrl && (
        <Image
          width={512}
          height={512}
          src={announcement.imageUrl}
          alt={`${announcement.title} imagen`}
          className="w-full max-w-[512px] rounded-md"
        />
      )}

      <article className="prose prose-lg dark:prose-invert max-w-none my-10">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw, rehypeYoutube]}
        >
          {announcement?.content}
        </ReactMarkdown>
      </article>
    </>
  );
};

export default AnnouncementPage;
