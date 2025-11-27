"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface Gallery4Props {
  items: Gallery4Item[];
}

const Gallery4 = ({ items }: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const baseLength = items.length || 1;
  const renderedItems = useMemo(() => {
    // Render a few copies so the loop feels seamless while images load.
    const copies = 3;
    return Array.from({ length: copies }, (_, copyIndex) =>
      items.map((item) => ({ ...item, _key: `${copyIndex}-${item.id}`, _copy: copyIndex })),
    ).flat();
  }, [items]);

  useEffect(() => {
    if (!carouselApi) return;
    const updateSelection = (slider: NonNullable<CarouselApi>) => {
      const details = slider.track?.details;
      if (!details) return;
      setCurrentSlide(details.rel % baseLength);
    };

    updateSelection(carouselApi);

    const handleChange = (slider: NonNullable<CarouselApi>) => updateSelection(slider);

    carouselApi.on("slideChanged", handleChange);
    carouselApi.on("created", handleChange);
    carouselApi.on("updated", handleChange);

    return () => {
      carouselApi.on("slideChanged", handleChange, true);
      carouselApi.on("created", handleChange, true);
      carouselApi.on("updated", handleChange, true);
    };
  }, [baseLength, carouselApi]);

  const goToSlide = (slideIndex: number) => {
    if (!carouselApi || !renderedItems.length) return;
    const details = carouselApi.track?.details;
    if (!details) return;

    // Pick the nearest clone of the requested slide to keep motion short.
    let closestIdx = slideIndex;
    let closestDistance = Math.abs(details.rel - slideIndex);
    for (let idx = slideIndex + baseLength; idx < renderedItems.length; idx += baseLength) {
      const distance = Math.abs(details.rel - idx);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIdx = idx;
      }
    }

    carouselApi.moveToIdx(closestIdx, true);
  };

  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="w-full flex justify-center">
        <div className="relative w-[98vw] sm:w-[92vw] lg:w-[84vw] xl:w-[78vw]">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-12 bg-gradient-to-r from-black via-black/40 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-12 bg-gradient-to-l from-black via-black/40 to-transparent" />
          <Carousel
            setApi={setCarouselApi}
            opts={useMemo(
              () => ({
                slides: {
                  perView: "auto",
                  spacing: 12,
                },
                breakpoints: {
                  "(max-width: 768px)": {
                    slides: {
                      perView: 1,
                      spacing: 8,
                    },
                    rubberband: false,
                  },
                  "(min-width: 768px)": {
                    slides: {
                      perView: 1.4,
                      spacing: 10,
                    },
                  },
                  "(min-width: 1024px)": {
                    slides: {
                      perView: 2,
                      spacing: 12,
                    },
                  },
                  "(min-width: 1280px)": {
                    slides: {
                      perView: 2.6,
                      spacing: 14,
                    },
                  },
                  "(min-width: 1536px)": {
                    slides: {
                      perView: 5,
                      spacing: 12,
                    },
                  },
                },
              }),
              [],
            )}
          >
            <CarouselContent className="ml-0 px-2 sm:px-4 lg:px-6 will-change-transform">
              {renderedItems.map((item, idx) => (
                <CarouselItem
                  key={item._key}
                  className="flex justify-center basis-auto snap-center"
                >
                  <a
                    href={item.href}
                    className="group block rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.28)]"
                  >
                    <div
                      className="relative bg-black transform-gpu w-[68vw] sm:w-[56vw] md:w-[48vw] lg:w-[360px] max-w-[360px]"
                      style={{ aspectRatio: "418 / 645" }}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1280px) 420px, (min-width: 1024px) 380px, (min-width: 768px) 60vw, 80vw"
                        className="object-contain object-center w-full h-full transition-transform duration-150 ease-out group-hover:scale-[1.015] will-change-transform"
                        loading={item._copy === 0 && idx < items.length ? "eager" : "lazy"}
                        priority={item._copy === 0 && idx < items.length}
                      />
                    </div>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="mt-6 sm:mt-8 flex justify-center gap-2">
            {items.map((_, slideIndex) => (
              <button
                key={slideIndex}
                className={`h-2 w-2 rounded-full transition-colors ${
                  currentSlide === slideIndex ? "bg-white" : "bg-white/30"
                }`}
                onClick={() => goToSlide(slideIndex)}
                aria-label={`Go to slide ${slideIndex + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Gallery4 };
