"use client";

import type { FC } from "react";
// import uploadContentImage from "../(actions)/upload-content-image.action";
// import { ArticleImage } from "@/interfaces/article.interface";
import { ForwardRefEditor } from "@/shared/components/mdx-editor/forward-ref-editor-component";

type Props = Readonly<{
  markdownString: string | undefined;
  setContent: (value: string) => void;
  // updateContentImage: (articleImage: ArticleImage) => void;
  articleId?: string;
}>;

export const MdEditorField: FC<Props> = ({
  markdownString,
  setContent,
  // updateContentImage,
  articleId
}) => {
  // const handleImageUpload = async (file: File) => {
  //   // const response = await uploadContentImage(file, articleId!);
  //   if (!response) throw new Error("No image URL returned");
  //   const { cloudinaryResponse } = response;
  //   updateContentImage({
  //     publicId: cloudinaryResponse.publicId,
  //     imageUrl: cloudinaryResponse.secureUrl,
  //   });
  //   return cloudinaryResponse.secureUrl;
  // };

  return (
    <>
      <ForwardRefEditor
        markdown={markdownString ?? ''}
        onChange={(value: string) => setContent(value)}
        // uploadImage={handleImageUpload}
      />
    </>
  );
};

export default MdEditorField;
