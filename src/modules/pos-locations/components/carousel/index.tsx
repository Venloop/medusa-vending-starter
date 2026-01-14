"use client"

import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { IconButton, clx } from "@medusajs/ui"
import { ChevronLeftMini, ChevronRightMini } from "@medusajs/icons"
import type { Swiper as SwiperType } from "swiper"
import Image from "next/image"

export function Carousel({
  images,
  thumbnail,
  "data-testid": dataTestid,
}: {
  images: any[]
  thumbnail: string | null
  "data-testid"?: string
}) {
  const swiperRef = useRef<SwiperType>()

  const handlePrev = () => {
    swiperRef.current?.slidePrev()
  }

  const handleNext = () => {
    swiperRef.current?.slideNext()
  }

  const handleSlideChange = (swiper: SwiperType) => {
    swiperRef.current = swiper
  }

  return (
    <div className="relative w-full" data-testid={dataTestid}>
      <Swiper onSwiper={handleSlideChange} loop={true}>
        {images.length > 0 ? (
          images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative">
                <Image
                  src={image?.image_url || image?.url}
                  alt={`Image ${index + 1}`}
                  className="w-full object-cover"
                  width={1000}
                  height={1000}
                />
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className="relative">
              <Image
                src={thumbnail || ""}
                alt="Thumbnail"
                className="w-full object-cover"
                width={1000}
                height={1000}
              />
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      {images.length > 1 && (
        <>
          <IconButton
            size="small"
            variant="transparent"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 shadow-lg z-10"
            onClick={handlePrev}
            data-testid="carousel-prev-button"
          >
            <ChevronLeftMini />
          </IconButton>

          <IconButton
            size="small"
            variant="transparent"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 shadow-lg z-10"
            onClick={handleNext}
            data-testid="carousel-next-button"
          >
            <ChevronRightMini />
          </IconButton>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => swiperRef.current?.slideTo(index)}
              className={clx(
                "w-2 h-2 rounded-full transition-all duration-200",
                {
                  "bg-white": swiperRef.current?.realIndex === index,
                  "bg-white/50 hover:bg-white/75":
                    swiperRef.current?.realIndex !== index,
                }
              )}
              data-testid={`carousel-dot-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
