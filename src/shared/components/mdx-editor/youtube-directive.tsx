import { DirectiveDescriptor } from '@mdxeditor/editor';
import { Trash2 } from 'lucide-react';
import { LeafDirective } from 'mdast-util-directive';

interface YoutubeDirectiveNode extends LeafDirective {
  name: 'youtube'
  attributes: { id: string }
}

export const YoutubeDirectiveDescriptor: DirectiveDescriptor<YoutubeDirectiveNode> = {
  name: 'youtube',
  type: 'leafDirective',
  testNode(node) {
    return node.name === 'youtube'
  },
  attributes: ['id'],
  hasChildren: false,
  Editor: ({ mdastNode, lexicalNode, parentEditor }) => {
    return (
      <div className="flex flex-col gap-5 relative">
        
        <div className="relative w-full pt-[56.25%]">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${mdastNode.attributes.id}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            className="absolute top-0 left-0 w-full h-full border-0 rounded"
          ></iframe>
        </div>
        <button
          onClick={() => {
            parentEditor.update(() => {
              lexicalNode.selectNext()
              lexicalNode.remove()
            })
          }}
          className="absolute bottom-5 opacity-70 hover:opacity-100 right-5 bg-red-500 text-pink-50 font-bold p-2 rounded cursor-pointer"
        >
          <Trash2 size={20} />
        </button>
      </div>
    )
  }
}
