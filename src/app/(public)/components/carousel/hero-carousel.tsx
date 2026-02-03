'use client';

import type { FC } from 'react';
import { useCallback, useEffect } from 'react';
import type { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import { DotButton, useDotButton } from './carousel-dot-button';
import { PrevButton, NextButton, usePrevNextButtons } from './carousel-arrow-buttons';
import Autoplay from 'embla-carousel-autoplay';
import ClassNames from 'embla-carousel-class-names';
import useEmblaCarousel from 'embla-carousel-react';
import "./embla.css";

type HeroImage = {
  id: string;
  url: string;
  title: string;
};

type Props = Readonly<{
  slides: number[];
  images: HeroImage[];
  play?: boolean;
  time?: number;
  options?: EmblaOptionsType;
}>;

export const HeroCarousel: FC<Props> = ({ slides, time = 5000, images, options, play = false }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({
      active: play,
      delay: time,
      stopOnInteraction: false,
    }),
    ClassNames({ active: true }),
  ]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    autoplay.stop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick,
  );

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi, onNavButtonClick);

  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!play) return;
    autoplay.play();
  }, [emblaApi, play]);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">
                <img
                  src={images[index % images.length].url}
                  alt={images[index % images.length].title}
                  className="embla__slide__img"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : '',
              )}
            />
          ))}
        </div>
      </div>

      <div className="embla__live-region" />
    </section>
  );
};
