"use client";

import { useEffect, useState } from "react";
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

const SLIDE_WIDTH = 418;
const SLIDE_HEIGHT = 645;

const Gallery4 = ({ items }: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;
    const updateSelection = () => setCurrentSlide(carouselApi.selectedScrollSnap());
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => carouselApi.off("select", updateSelection);
  }, [carouselApi]);

  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="w-full flex justify-center">
        <div className="w-[98vw] sm:w-[92vw] lg:w-[84vw] xl:w-[78vw]">
          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: "center",
              containScroll: "trimSnaps",
              breakpoints: {
                "(max-width: 768px)": {
                  dragFree: true,
                },
              },
            }}
          >
            <CarouselContent className="ml-0 px-4 sm:px-8 lg:px-10">
              {items.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="pl-[16px] lg:pl-[20px] flex justify-center basis-auto"
                >
                  <a
                    href={item.href}
                    className="group block rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                  >
                    <div
                      className="relative bg-black"
                      style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT }}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={SLIDE_WIDTH}
                        height={SLIDE_HEIGHT}
                        className="object-contain object-center w-full h-full transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
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
                onClick={() => carouselApi?.scrollTo(slideIndex)}
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
