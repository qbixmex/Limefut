'use client';

import { useEffect, type FC } from "react";
import type { CustomPageImage } from "@/shared/interfaces/Page";
import { ForwardRefEditor } from "@/shared/components/mdx-editor/forward-ref-editor-component";
import { uploadPageContentImageAction } from "../(actions)/uploadPageContentImageAction";
import { toast } from "sonner";

type Props = Readonly<{
  markdownString: string | undefined;
  setContent: (value: string) => void;
  updateContentImage: (pageImage: CustomPageImage) => void;
  pageId: string;
}>;

export const MdEditorField: FC<Props> = ({
  markdownString,
  setContent,
  updateContentImage,
  pageId,
}) => {
  const handleImageUpload = async (file: File) => {
    const { message, cloudinaryResponse } = await uploadPageContentImageAction(file, pageId);

    if (!cloudinaryResponse) {
      toast.error(message);
      return '';
    }

    updateContentImage({
      publicId: cloudinaryResponse.publicId,
      imageUrl: cloudinaryResponse.secureUrl,
    });

    if (cloudinaryResponse) {
      toast.success(message);
    }

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
