"use client";

import * as React from "react";
import "keen-slider/keen-slider.min.css";
import {
  useKeenSlider,
  type KeenSliderInstance,
  type KeenSliderOptions,
  type KeenSliderPlugin,
} from "keen-slider/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CarouselApi = KeenSliderInstance | null;
type CarouselOptions = KeenSliderOptions;
type CarouselPlugin = KeenSliderPlugin;

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin[];
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: (node: HTMLDivElement | null) => void;
  api: CarouselApi;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [slider, setSlider] = React.useState<KeenSliderInstance | null>(null);
    const [canScrollPrev, setCanScrollPrev] = React.useState(true);
    const [canScrollNext, setCanScrollNext] = React.useState(true);

    const updateCanScroll = React.useCallback((slider: KeenSliderInstance) => {
      if (slider.options.loop) {
        setCanScrollPrev(true);
        setCanScrollNext(true);
        return;
      }
      const details = slider.track.details;
      if (!details) return;
      const nextPrev = details.rel > 0;
      const nextNext = details.rel < details.slides.length - details.size;
      setCanScrollPrev((prev) => (prev === nextPrev ? prev : nextPrev));
      setCanScrollNext((prev) => (prev === nextNext ? prev : nextNext));
    }, []);

    const mergedOptions = React.useMemo<CarouselOptions>(() => {
      const { slides, created, slideChanged, updated, ...restOpts } =
        opts ?? {};

      return {
        loop: true,
        rubberband: false,
        vertical: orientation === "vertical",
        ...restOpts,
        slides: {
          origin: "center",
          perView: "auto",
          spacing: 16,
          ...(slides ?? {}),
        },
        created(slider) {
          setSlider((prev) => (prev === slider ? prev : slider));
          updateCanScroll(slider);
          created?.(slider);
        },
        slideChanged(slider) {
          updateCanScroll(slider);
          slideChanged?.(slider);
        },
        updated(slider) {
          updateCanScroll(slider);
          updated?.(slider);
        },
      };
    }, [opts, orientation, updateCanScroll]);

    const [carouselRef, instanceRef] = useKeenSlider<HTMLDivElement>(
      mergedOptions,
      plugins,
    );
    const api = slider ?? instanceRef.current;

    React.useEffect(() => {
      if (!setApi || !api) return;
      setApi(api);
    }, [api, setApi]);

    const scrollPrev = React.useCallback(() => {
      api?.prev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.next();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts: mergedOptions,
          orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();
  const mergedRef = React.useMemo(
    () => mergeRefs(ref, carouselRef),
    [ref, carouselRef],
  );
  return (
    <div className="overflow-hidden">
      <div
        ref={mergedRef}
        className={cn(
          "keen-slider",
          orientation === "vertical" && "keen-slider--vertical",
          className,
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn("keen-slider__slide min-w-0", className)}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
