'use client';

import type { FC } from "react";
import type { CustomPageImage } from "@/shared/interfaces/Page";
import { ForwardRefEditor } from "@/shared/components/mdx-editor/forward-ref-editor-component";
import { uploadPageContentImageAction } from "../(actions)/uploadPageContentImageAction";

type Props = Readonly<{
  markdownString: string | undefined;
  setContent: (value: string) => void;
  updateContentImage: (pageImage: CustomPageImage) => void;
  pageId?: string;
}>;

export const MdEditorField: FC<Props> = ({
  markdownString,
  setContent,
  updateContentImage,
  pageId,
}) => {
  const handleImageUpload = async (file: File) => {
  const response = await uploadPageContentImageAction(file, pageId!);
    if (!response) throw new Error("No image URL returned");
    const { cloudinaryResponse } = response;
    updateContentImage({
      publicId: cloudinaryResponse.publicId,
      imageUrl: cloudinaryResponse.secureUrl,
    });
    return cloudinaryResponse.secureUrl;
  };

  return (
    <>
      <ForwardRefEditor
        markdown={markdownString ?? ''}
        onChange={(value: string) => setContent(value)}
        uploadImage={handleImageUpload}
      />
    </>
  );
};

export default MdEditorField;
