import type { FC } from 'react';
import { redirect } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { fetchCustomPageAction } from '../(actions)/fetchCustomPageAction';
import { rehypeYoutube } from '@/lib/rehype-youtube';
import 'highlight.js/styles/tokyo-night-dark.min.css';
import { cn } from '@/lib/utils';
import './styles.css';

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>;
}>;

export const PageView: FC<Props> = async ({ params }) => {
  const permalink = (await params).permalink;

  const { ok, message, customPage } = await fetchCustomPageAction(permalink);

  if (!ok || !customPage) {
    redirect(`/?error=${encodeURIComponent(message)}`);
  }

  return (
    <>
      <h1 className="level-1">{customPage.title}</h1>

      <section
        className={cn([
          'prose',
          'prose-lg',
          'dark:prose-invert',
          'max-w-none mb-5',
        ])}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw, rehypeYoutube]}
        >
          {customPage.content ?? '¡ El contenido no esta disponible !'}
        </ReactMarkdown>
      </section>
    </>
  );
};
