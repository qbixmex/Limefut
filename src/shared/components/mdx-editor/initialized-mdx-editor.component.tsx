'use client';

import type { ForwardedRef } from 'react';
import {
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CodeToggle,
  ListsToggle,
  DiffSourceToggleWrapper,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  InsertImage,
  // Plugins
  toolbarPlugin,
  headingsPlugin,
  quotePlugin,
  listsPlugin,
  linkPlugin,
  markdownShortcutPlugin,
  thematicBreakPlugin,
  tablePlugin,
  imagePlugin,
  diffSourcePlugin,
  codeBlockPlugin,
  directivesPlugin,
  Separator,
  MDXEditor,
  codeMirrorPlugin,
  type MDXEditorMethods,
  type MDXEditorProps
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css'
import { basicDark } from 'cm6-theme-basic-dark';
import { YoutubeDirectiveDescriptor } from './youtube-directive';
import YouTubeButton from './youtube-btn.component';
import './theme.css';

type Props =
  & { editorRef: ForwardedRef<MDXEditorMethods> | null }
  & MDXEditorProps
  & { uploadImage?: (file: File) => Promise<string> };

const InitializedMDXEditor = ({ editorRef, uploadImage, ...props }: Props) => {
  return (
    <MDXEditor
      className="dark-theme dark-editor"
      contentEditableClassName="prose"
      plugins={[
        headingsPlugin(),
        quotePlugin(),
        listsPlugin(),
        markdownShortcutPlugin(),
        thematicBreakPlugin(),
        tablePlugin(),
        linkPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
        directivesPlugin({
          directiveDescriptors: [YoutubeDirectiveDescriptor]
        }),
        imagePlugin({
          imageUploadHandler: async (file: File) => {
            try {
              let url = "";
              if (typeof uploadImage === 'function') {
                url = await uploadImage(file);
              }
              return url;
            } catch (error) {
              console.error('[imagePlugin] error uploading image:', error);
              throw error;
            }
          },
        }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            txt: 'text',
            js: 'JavaScript',
            ts: 'TypeScript',
            sass: 'SASS',
            css: 'CSS',
            py: 'Python',
            java: 'Java',
            kt: 'Kotlin',
            c: 'C',
            "c++": 'C++',
            php: 'PHP',
          },
          codeMirrorExtensions: [basicDark]
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper>
              <BoldItalicUnderlineToggles />
              <BlockTypeSelect />
              <CodeToggle />
              <Separator />
              <ListsToggle />
              <Separator />
              <InsertTable />
              <InsertCodeBlock />
              <InsertThematicBreak />
              <Separator />
              <InsertImage />
              <YouTubeButton />
              <Separator />
              <UndoRedo />
            </DiffSourceToggleWrapper>
          )
        }),
        diffSourcePlugin({
          viewMode: 'rich-text',
          diffMarkdown: props.markdown,
          codeMirrorExtensions: [basicDark],
          readOnlyDiff: true,
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  )
};

export default InitializedMDXEditor;
