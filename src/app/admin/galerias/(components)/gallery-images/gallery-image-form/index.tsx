'use client';

import { useState, type FC } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useImageGallery } from '@/store';
import { CreateGalleryImageForm } from './create-gallery-image-form';
import { EditGalleryImageForm } from './edit-gallery-image-form';

type Props = Readonly<{
  galleryId: string;
  imagesQuantity: number;
}>;

export const AddImage: FC<Props> = ({ galleryId, imagesQuantity }) => {
  const { galleryImage, clearGalleryImage } = useImageGallery();
  const [isOpen, setIsOpen] = useState(false);
  const isEditing = galleryImage !== null;

  const handleEditSuccess = () => {
    clearGalleryImage();
    setIsOpen(false);
  };

  return (
    <Sheet
      open={isEditing || isOpen}
      onOpenChange={(open) => {
        if (!open && isEditing) {
          clearGalleryImage();
        }
        setIsOpen(open);
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              variant="outline-primary"
              size="icon"
              aria-label="Subir imagen"
            >
              <Plus strokeWidth={3} aria-hidden="true" />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">Subir Imagen</TooltipContent>
      </Tooltip>

      <SheetContent side="right" onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>
            {isEditing ? 'Editar Imagen' : 'Subir Imagen'}
          </SheetTitle>
        </SheetHeader>

        <section className="p-5">
          {galleryImage ? (
            <EditGalleryImageForm
              galleryImage={galleryImage}
              onSuccess={handleEditSuccess}
            />
          ) : (
            <CreateGalleryImageForm
              galleryId={galleryId}
              imagesQuantity={imagesQuantity}
              onSuccess={() => setIsOpen(false)}
            />
          )}
        </section>
      </SheetContent>
    </Sheet>
  );
};
