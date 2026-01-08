'use client';

import { type FC, useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from "motion/react";
import type { GalleryImageType } from '../(actions)/fetchGalleryAction';
import Image from "next/image";
import { ChevronLeft, ChevronRight, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import "./styles.css";

type SelectedImage = {
  id: string;
  url: string;
  title: string;
};

type Props = Readonly<{
  galleryImages: GalleryImageType[];
}>;

export const ImageGallery: FC<Props> = ({ galleryImages }) => {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto"; // Cleanup
    };
  }, [lightboxOpen]);

  const loadImage = useCallback((operator: '+' | '-') => {
    let currentIndex = galleryImages.findIndex((item) => {
      return selectedImage && item.id === selectedImage.id;
    });
    let nextIndex: number;
    const itemsQuantity = galleryImages.length;

    switch (operator) {
      case '+':
        nextIndex = (currentIndex += 1) % itemsQuantity;
        break;
      case '-':
        nextIndex = ((currentIndex -= 1) + itemsQuantity) % itemsQuantity;
        break;
      default:
        nextIndex = 0;
    }

    setSelectedImage({
      id: galleryImages[nextIndex].id,
      url: galleryImages[nextIndex].imageUrl,
      title: galleryImages[nextIndex].title,
    });
  }, [galleryImages, selectedImage]);

  const openLightbox = (selectedImage: SelectedImage) => {
    setSelectedImage(selectedImage);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setLightboxOpen(false);
  };

  useEffect(() => {
    const onKeyPressed = (event: KeyboardEvent) => {
      if (lightboxOpen) {
        if (event.key === 'Escape' && lightboxOpen) {
          setLightboxOpen(false);
        }
        if (event.key === "ArrowRight") {
          loadImage("+");
        }
        if (event.key === "ArrowLeft") {
          loadImage("-");
        }
      }
    };

    document.addEventListener('keydown', onKeyPressed);

    return () => {
      document.removeEventListener('keydown', onKeyPressed);
    };
  }, [lightboxOpen, loadImage]);

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
      >
        <motion.figure
          initial="hidden"
          animate="visible"
          className="gallery"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              className="gallery-item group"
              key={image.id}
              variants={{
                hidden: {
                  scale: 0.75,
                  opacity: 0,
                },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    delay: 0.25 * index,
                    ease: "easeOut",
                  },
                },
              }}
              onClick={() => {
                openLightbox({
                  id: image.id,
                  url: image.imageUrl,
                  title: image.title,
                });
              }}
            >
              <Image
                src={image.imageUrl}
                width={300}
                height={300}
                alt={image.title}
                className="gallery-image"
                loading="eager"
              />
              <figcaption className="image-caption opacity-0 group-hover:opacity-100 group-hover:bg-black/50">
                <p className="scale-x-50 group-hover:scale-x-100">{image.title}</p>
              </figcaption>
            </motion.div>
          ))}
        </motion.figure>
      </motion.div>
      <AnimatePresence>
        {lightboxOpen && selectedImage && (
          <motion.div className="overlay">
            <motion.div className="overlay-container">
              <div className="flex flex-col">
                <div className="image-container">
                  <Image
                    src={selectedImage.url}
                    width={1024}
                    height={1024}
                    alt={selectedImage.title}
                    className="image"
                  />
                </div>
                <div className="image-details">
                  <div className="image-title">
                    <p>{selectedImage.title}</p>
                  </div>
                  <div>
                    <p className="current-image">
                      <span>Imagen</span>
                      <span className="inline-flex gap-2">
                        <span>
                          {galleryImages.findIndex((item) => {
                            return item.id === selectedImage.id;
                          }) + 1}
                        </span>
                        <span>de</span>
                        <span>{galleryImages.length}</span>
                      </span>
                    </p>
                    <div className="navigation-buttons">
                      <button
                        className="navigation-btn"
                        onClick={() => loadImage("-")}
                      >
                        <ChevronLeft />
                      </button>
                      <button
                        className="navigation-btn selected"
                        onClick={() => loadImage("+")}
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                className="close-btn"
                variant="outline-info"
                size="icon-sm"
                onClick={() => closeLightbox()}
              >
                <XIcon
                  strokeWidth={3}
                  size={28}
                  className="close-icon"
                />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;