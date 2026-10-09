import { useState } from 'react';
import type { CustomPageImage } from '@/shared/interfaces/Page';
import { toast } from 'sonner';
import { deleteContentImageAction } from '../../(actions)/delete-content-image';

export const useContentImage = (
  pageId: string,
  onImageDeleted?: (resourceId: string) => void,
) => {
  const [isDeletingImage, setIsDeletingImage] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    if (typeof window === 'undefined') return false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // fallback: prompt sin manipular el DOM
      window.prompt('Copia la URL (Cmd/Ctrl+C):', text);
      return false;
    } catch {
      return false;
    }
  };

  const handleDeleteImage = async (customPageImage: CustomPageImage) => {
    setIsDeletingImage(customPageImage.imageUrl);

    const response = await deleteContentImageAction(
      pageId as string,
      customPageImage.resourceId,
    );

    if (response.ok) {
      onImageDeleted?.(customPageImage.resourceId);
      setIsDeletingImage(null);
      toast.success('Imagen eliminada correctamente');
    }

    if (!response.ok) {
      setIsDeletingImage(null);
      toast.error('No se pudo eliminar la imagen');
    }
  };

  return {
    isDeletingImage,
    copyToClipboard,
    handleDeleteImage,
  };
};
