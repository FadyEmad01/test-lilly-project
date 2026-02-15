"use client"

import { useEffect, useState } from "react"
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import MediaDisplay from "./media-display"
// import Autoplay from "embla-carousel-autoplay"

interface MediaItem {
  type: "image" | "video"
  url: string
  thumbnail?: string
}

interface ImageSwiperProps {
  images?: string[]
  videos?: string[]
  media?: MediaItem[]
  alt: string
}

export default function ImageSwiper({ images, videos, media, alt }: ImageSwiperProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)


  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])



  // Combine all media into a single array
  const allMedia: MediaItem[] = []

  if (media) {
    allMedia.push(...media)
  } else {
    if (images) {
      allMedia.push(...images.map((url) => ({ type: "image" as const, url })))
    }
    if (videos) {
      allMedia.push(...videos.map((url) => ({ type: "video" as const, url })))
    }
  }

  if (!allMedia || allMedia.length === 0) return null

  if (allMedia.length === 1) {
    const currentMedia = allMedia[0]
    return (
      <div className="relative h-[400px] rounded-xl overflow-hidden">
        <MediaDisplay
          src={currentMedia.url}
          alt={alt}
          type={currentMedia.type}
          className="w-full h-full"
          sizes="(max-width: 375px) 310px, 900px"
          controls={currentMedia.type === "video"}
          thumbnail={currentMedia.thumbnail}
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      <Carousel
        setApi={setApi}
        // plugins={[
        //   Autoplay({
        //     delay: 2000
        //   })
        // ]}
        opts={{
          loop: true,
        }}
        className="w-full">
        <CarouselContent>
          {allMedia.map((mediaItem, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[400px] rounded-xl overflow-hidden"
                onMouseDown={(e) => {
                  // Prevent carousel drag when interacting with video
                  if (mediaItem.type === "video") {
                    e.stopPropagation()
                  }
                }}
              >
                <MediaDisplay
                  src={mediaItem.url}
                  alt={`${alt} - ${index + 1}`}
                  type={mediaItem.type}
                  className="w-full h-full"
                  sizes="(max-width: 375px) 310px, 900px"
                  controls={mediaItem.type === "video"}
                  thumbnail={mediaItem.thumbnail}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-black/10 backdrop-blur-3xl text-white" />

        <CarouselNext className="right-4 bg-black/10 backdrop-blur-3xl text-white" />
      </Carousel>
      <div className="text-black py-2 text-center text-sm">
        Slide {current} of {count}
      </div>
      {/* Dots indicator */}
      {/* <div className="flex justify-center gap-x-2.5 mt-3.5">
        {allMedia.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full border border-black transition-colors ${index === current ? "bg-black" : "bg-transparent"
              }`}
          />
        ))}
      </div> */}
    </div>
  )
}
