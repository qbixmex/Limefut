'use client';

import type { FC } from 'react';
import { useCallback, useEffect } from 'react';
import type { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import { PrevButton, NextButton, usePrevNextButtons } from './carousel-arrow-buttons';
import Autoplay from 'embla-carousel-autoplay';
import ClassNames from 'embla-carousel-class-names';
import useEmblaCarousel from 'embla-carousel-react';
import { BannerImage } from '~/src/shared/components/banner-image';
import type { HeroBanner } from '../../(actions)/home/fetchPublicHeroBannersAction';
import { DotButton, useDotButton } from './carousel-dot-button';
import "./embla.css";

type Props = Readonly<{
  banners: HeroBanner[];
  play?: boolean;
  time?: number;
  options?: EmblaOptionsType;
}>;

export const HeroCarousel: FC<Props> = ({
  banners,
  time = 5000,
  options,
  play = false,
}) => {
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

  const { selectedIndex, onDotButtonClick } = useDotButton(
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
          {banners.map((banner) => (
            <div className="embla__slide" key={banner.id}>
              <div className="embla__slide__number">
                <BannerImage
                  title={banner.title}
                  description={banner.description}
                  imageUrl={banner.imageUrl}
                  dataAlignment={banner.dataAlignment}
                  showData={banner.showData}
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
          {banners.map(({ id }, index) => (
            <DotButton
              key={id}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : '',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
