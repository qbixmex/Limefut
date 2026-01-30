/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

const YOUTUBE_LINK_REGEX = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
const YOUTUBE_DIRECTIVE_REGEX = /::youtube(?:\[(.*?)\])?\{#([A-Za-z0-9_-]+)\}/g;
const YOUTUBE_CLASS = 'youtube-responsive';

export const rehypeYoutube = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node: any, index?: number, parent?: any) => {
      if (!parent || typeof index !== 'number') return;

      // 1) <p><a href="youtube link">...</a></p> -> iframe
      if (
        node.tagName === 'p' &&
        Array.isArray(node.children) &&
        node.children.length === 1 &&
        (node.children[0] as Element).tagName === 'a'
      ) {
        const aNode = node.children[0] as Element;
        const url =
          aNode.properties && typeof aNode.properties.href === 'string'
            ? aNode.properties.href
            : '';
        const match = url.match(YOUTUBE_LINK_REGEX);
        if (match) {
          const videoId = match[1];
          parent.children[index] = makeIframeNode(videoId, aNode.properties?.title as string | undefined);
          return;
        }
      }

      // 2) <p>...::youtube{#id}...</p> -> reemplazar el <p> completo por text/iframes
      if (node.tagName === 'p' && Array.isArray(node.children)) {
        // concatenar solo nodos de texto para buscar directivas
        const textChildren = node.children.filter((c: any) => c.type === 'text');
        const concat = textChildren.map((c: any) => c.value).join('');
        if (YOUTUBE_DIRECTIVE_REGEX.test(concat)) {
          const newNodes: any[] = [];
          let lastIndex = 0;
          YOUTUBE_DIRECTIVE_REGEX.lastIndex = 0;
          let m: RegExpExecArray | null;
          while ((m = YOUTUBE_DIRECTIVE_REGEX.exec(concat)) !== null) {
            const [fullMatch, altText, id] = m;
            const start = m.index;
            if (start > lastIndex) {
              newNodes.push({ type: 'text', value: concat.slice(lastIndex, start) });
            }
            newNodes.push(makeIframeNode(id, altText || undefined));
            lastIndex = start + fullMatch.length;
          }
          if (lastIndex < concat.length) {
            newNodes.push({ type: 'text', value: concat.slice(lastIndex) });
          }

          // reemplaza el nodo <p> completo por la secuencia resultante
          parent.children.splice(index, 1, ...newNodes);
          return;
        }
      }
    });
  };
};

function makeIframeNode(videoId: string, title?: string) {
  return {
    type: 'element',
    tagName: 'div',
    properties: { className: [YOUTUBE_CLASS], style: 'position:relative;width:100%;padding-top:56.25%;' },
    children: [
      {
        type: 'element',
        tagName: 'iframe',
        properties: {
          src: `https://www.youtube.com/embed/${videoId}`,
          frameborder: '0',
          allowfullscreen: true,
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          title: title ?? 'YouTube video',
          style: 'position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:8px;'
        },
        children: [],
      },
    ],
  } as Element;
}

export default rehypeYoutube;
