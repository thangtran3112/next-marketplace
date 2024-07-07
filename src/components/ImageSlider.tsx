"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import type SwiperType from "swiper";
import { useEffect, useState } from "react";
import { Pagination } from "swiper/modules";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderProps {
  urls: string[];
}

const activeStyles =
  "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300";
const inactiveStyles = "hidden text-gray-400";

/**
 * Airbnb style image slider
 * We override the pagination bullet styles in global.css
 */
const ImageSlider = ({ urls }: ImageSliderProps) => {
  // swiper instance state
  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  //keeping track if we are at the beginning or end of the images array
  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: activeIndex === (urls.length ?? 0) - 1,
  });

  //checking if we are at the beginning or end of the images array
  useEffect(() => {
    swiper?.on("slideChange", ({ activeIndex }) => {
      setActiveIndex(activeIndex);
      setSlideConfig({
        isBeginning: activeIndex === 0, // at first image or the beginning
        isEnd: activeIndex === (urls.length ?? 0) - 1, // reached last image or the end
      });
    });
  }, [swiper, urls]);

  return (
    <div className="group relative bg-zinc-100 aspect-square overflow-hidden rounded-xl">
      {/* Only display the arrow slider when hovering on the image */}
      <div className="absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition">
        {/* Swipe Right (Next Image) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slideNext();
          }}
          className={cn(activeStyles, "right-3 transition", {
            [inactiveStyles]: slideConfig.isEnd, //switching to inactiveStyles when at the end
            "hover:bg-primary-300 text-primary-800 opacity-100":
              !slideConfig.isEnd,
          })}
          aria-label="next image"
        >
          <ChevronRight className="h-4 w-4 text-zinc-700" />{" "}
        </button>
        {/* Swipe Left (Previous Image) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slidePrev();
          }}
          className={cn(activeStyles, "left-3 transition", {
            [inactiveStyles]: slideConfig.isBeginning,
            "hover:bg-primary-300 text-primary-800 opacity-100":
              !slideConfig.isBeginning,
          })}
          aria-label="previous image"
        >
          <ChevronLeft className="h-4 w-4 text-zinc-700" />{" "}
        </button>
      </div>

      {/* Image slider with react Swiper */}
      <Swiper
        pagination={{
          renderBullet: (_, className) => {
            return `<span class="rounded-full transition ${className}"></span>`;
          },
        }}
        onSwiper={(swiper) => setSwiper(swiper)}
        spaceBetween={50}
        modules={[Pagination]} // allow swiping left and right between images
        slidesPerView={1} // 1 image per slide
        className="h-full w-full"
      >
        {urls.map((url, index) => (
          <SwiperSlide key={index} className="-z-10 relative h-full w-full">
            <Image
              fill
              loading="eager"
              className="-z-10 h-full w-full object-cover object-center"
              src={url}
              alt="Product image"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
