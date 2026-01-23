'use client';

import type { ComponentType } from 'react';
import { forwardRef, type ForwardedRef } from 'react';
import dynamic from 'next/dynamic';
import type { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor';

type EditorProps = MDXEditorProps & {
  uploadImage?: (file: File) => Promise<string>;
  editorRef?: ForwardedRef<MDXEditorMethods> | null;
};

// This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(
  () => import('./initialized-mdx-editor.component'),
  { ssr: false },
) as unknown as ComponentType<EditorProps>;

export const ForwardRefEditor = forwardRef<MDXEditorMethods, EditorProps>(
  (props, ref) => <Editor {...props} editorRef={ref} />,
);

ForwardRefEditor.displayName = 'ForwardRefEditor';

export default ForwardRefEditor;
