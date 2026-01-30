'use client';

import { type ForwardedRef } from 'react';
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
  type MDXEditorProps,
} from '@mdxeditor/editor';
import { YouTubeButton } from './youtube-btn.component';
import '@mdxeditor/editor/style.css';
import { basicDark } from 'cm6-theme-basic-dark';
import { YoutubeDirectiveDescriptor } from './youtube-directive';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import './theme.css';

type Props =
  & { editorRef: ForwardedRef<MDXEditorMethods> | null }
  & MDXEditorProps
  & { uploadImage?: (file: File) => Promise<string> };

const spanishLocalization: Record<string, string> = {
  // Frontmatter Editor
  'frontmatterEditor.title': 'Editar frontmatter del documento',
  'frontmatterEditor.key': 'Clave',
  'frontmatterEditor.value': 'Valor',
  'frontmatterEditor.addEntry': 'Añadir entrada',

  // Controles de Diálogo
  'dialogControls.save': 'Guardar',
  'dialogControls.cancel': 'Cancelar',

  // Subida de Imagen
  'uploadImage.dialogTitle': 'Subir una imagen',
  'uploadImage.uploadInstructions': 'Sube una imagen desde tu dispositivo:',
  'uploadImage.addViaUrlInstructions': 'O añade una imagen desde una URL:',
  'uploadImage.autoCompletePlaceholder': 'Selecciona o pega el src de la imagen',
  'uploadImage.alt': 'Alt:',
  'uploadImage.title': 'Título:',
  'uploadImage.width': 'Ancho:',
  'uploadImage.height': 'Alto:',

  // Editor de Imagen
  'imageEditor.deleteImage': 'Borrar imagen',
  'imageEditor.editImage': 'Editar imagen',

  // Crear Enlace
  'createLink.url': 'URL',
  'createLink.urlPlaceholder': 'Selecciona o pega una URL',
  'createLink.text': 'Texto ancla',
  'createLink.textTooltip': 'El texto que se mostrará para el enlace',
  'createLink.title': 'Título',
  'createLink.titleTooltip': 'El atributo de título del enlace, mostrado al pasar el cursor',
  'createLink.saveTooltip': 'Establecer URL',
  'createLink.cancelTooltip': 'Cancelar cambios',

  // Previsualización de Enlace
  'linkPreview.open': 'Abrir {{url}} en una ventana nueva',
  'linkPreview.edit': 'Editar URL del enlace',
  'linkPreview.copyToClipboard': 'Copiar al portapapeles',
  'linkPreview.copied': '¡Copiado!',
  'linkPreview.remove': 'Borrar enlace',

  // Tabla
  'table.deleteTable': 'Borrar tabla',
  'table.columnMenu': 'Menú de columna',
  'table.textAlignment': 'Alineación del texto',
  'table.alignLeft': 'Alinear a la izquierda',
  'table.alignCenter': 'Alinear al centro',
  'table.alignRight': 'Alinear a la derecha',
  'table.insertColumnLeft': 'Añadir una columna a la izquierda de esta',
  'table.insertColumnRight': 'Añadir una columna a la derecha de esta',
  'table.deleteColumn': 'Borrar esta columna',
  'table.rowMenu': 'Menú de fila',
  'table.insertRowAbove': 'Insertar una fila por encima de esta',
  'table.insertRowBelow': 'Insertar una fila por debajo de esta',
  'table.deleteRow': 'Borrar esta fila',

  // Barra de herramientas
  'toolbar.blockTypes.paragraph': 'Párrafo',
  'toolbar.blockTypes.quote': 'Cita',
  'toolbar.blockTypes.heading': 'Encabezado {{level}}',
  'toolbar.blockTypeSelect.selectBlockTypeTooltip': 'Selecciona el tipo de bloque',
  'toolbar.blockTypeSelect.placeholder': 'Tipo de bloque',
  'toolbar.toggleGroup': 'Conmutar grupo',
  'toolbar.removeBold': 'Borrar negrita',
  'toolbar.bold': 'Negrita',
  'toolbar.removeItalic': 'Borrar cursiva',
  'toolbar.italic': 'Cursiva',
  'toolbar.underline': 'Subrayado',
  'toolbar.removeUnderline': 'Borrar subrayado',
  'toolbar.removeInlineCode': 'Borrar formato de código',
  'toolbar.inlineCode': 'Formato de código en línea',
  'toolbar.link': 'Crear enlace',
  'toolbar.richText': 'Texto enriquecido',
  'toolbar.diffMode': 'Modo diferencial',
  'toolbar.source': 'Modo fuente',
  'toolbar.admonition': 'Insertar admonición',
  'toolbar.codeBlock': 'Insertar bloque de código',
  'toolbar.editFrontmatter': 'Editar frontmatter',
  'toolbar.insertFrontmatter': 'Insertar frontmatter',
  'toolbar.image': 'Insertar imagen',
  'toolbar.insertSandpack': 'Insertar Sandpack',
  'toolbar.table': 'Insertar tabla',
  'toolbar.thematicBreak': 'Insertar salto de línea',
  'toolbar.bulletedList': 'Lista con viñetas',
  'toolbar.numberedList': 'Lista numerada',
  'toolbar.checkList': 'Lista de verificación',
  'toolbar.deleteSandpack': 'Borrar este bloque de código',
  'toolbar.undo': 'Deshacer',
  'toolbar.redo': 'Rehacer',
  'toolbar.highlight': 'Resaltar',
  'toolbar.removeHighlight': 'Quitar resaltado',

  // Admoniciones
  'admonitions.note': 'Nota',
  'admonitions.tip': 'Consejo',
  'admonitions.danger': 'Peligro',
  'admonitions.info': 'Información',
  'admonitions.caution': 'Aviso',
  'admonitions.changeType': 'Seleccionar tipo de admonición',
  'admonitions.placeholder': 'Tipo de admonición',

  // Bloque de Código
  'codeBlock.language': 'Lenguaje del bloque de código',
  'codeBlock.selectLanguage': 'Seleccionar el lenguaje del bloque de código',

  // Área de Contenido
  'contentArea.editableMarkdown': 'Markdown editable',
};

const InitializedMDXEditor = ({ editorRef, uploadImage, ...props }: Props) => {
  const { resolvedTheme } = useTheme();
  return (
    <MDXEditor
      className={cn({
        "light-editor": resolvedTheme === 'light',
        "dark-theme dark-editor": resolvedTheme === 'dark',
      })}
      contentEditableClassName="prose"
      translation={(key, defaultValue, interpolations) => {
        let result = spanishLocalization[key] || defaultValue;
        if (interpolations) {
          Object.entries(interpolations).forEach(([placeholder, value]) => {
            result = result.replace(`{{${placeholder}}}`, String(value));
          });
        }
        return result;
      }}
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
          directiveDescriptors: [YoutubeDirectiveDescriptor],
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
              console.error('[imagePlugin] error al subir la imagen:', error);
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
          codeMirrorExtensions: [basicDark],
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
              <UndoRedo />
            </DiffSourceToggleWrapper>
          ),
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
  );
};

export default InitializedMDXEditor;
