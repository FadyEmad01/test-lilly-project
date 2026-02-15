// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import { getStaticImagePlaceholder, getColoredBlurPlaceholder } from "@/lib/plaiceholder"

// interface BlurImageProps {
//   src: string
//   alt: string
//   fill?: boolean
//   width?: number
//   height?: number
//   className?: string
//   sizes?: string
//   priority?: boolean
//   isStatic?: boolean
//   onClick?: () => void
//   blurColor?: "blue" | "green" | "orange" | "pink" | "yellow"
// }

// export default function BlurImage({
//   src,
//   alt,
//   fill = false,
//   width,
//   height,
//   className = "",
//   sizes,
//   priority = false,
//   isStatic = false,
//   onClick,
//   blurColor = "blue",
// }: BlurImageProps) {
//   // Initialize with a default blur immediately
//   const [blurDataURL, setBlurDataURL] = useState<string>(getStaticImagePlaceholder().blurDataURL)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     // Use simple static blur placeholders
//     if (isStatic || src.includes("/placeholder.svg")) {
//       const { blurDataURL } = getStaticImagePlaceholder()
//       setBlurDataURL(blurDataURL)
//     } else {
//       // Use colored blur based on image or preference
//       const { blurDataURL } = getColoredBlurPlaceholder(blurColor)
//       setBlurDataURL(blurDataURL)
//     }
//     setIsLoading(false)
//   }, [src, isStatic, blurColor])

//   const imageProps = {
//     src,
//     alt,
//     className: `${className} transition-opacity duration-300`,
//     sizes,
//     priority,
//     placeholder: "blur" as const,
//     blurDataURL, // This is now always guaranteed to have a value
//     onClick,
//     onLoad: () => setIsLoading(false),
//   }

//   if (fill) {
//     return <Image {...imageProps} fill alt="Description of the image" />
//   }

//   return <Image {...imageProps} width={width} height={height} alt="Description of the image" />
// }


"use client"

import { useState, useEffect } from "react"
import Image, { StaticImageData } from "next/image"
import { getStaticImagePlaceholder, getColoredBlurPlaceholder } from "@/lib/image-utils"

interface BlurImageProps {
  src: string | StaticImageData; // Accept both strings and local imports
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onClick?: () => void;
  blurColor?: "blue" | "green" | "orange" | "pink" | "yellow";
}

export default function BlurImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  sizes,
  priority = false,
  onClick,
  blurColor = "blue",
}: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  
  // Determine if this is a static import (object) or a remote/public string
  const isStaticImport = typeof src === "object"
  
  // Default to the logic you already had for remote/path strings
  const [blurDataURL, setBlurDataURL] = useState<string>(
    isStaticImport ? "" : getStaticImagePlaceholder().blurDataURL
  )

  useEffect(() => {
    if (!isStaticImport) {
      // Only generate dynamic color placeholders for strings (remote or /public)
      const { blurDataURL: colorBlur } = getColoredBlurPlaceholder(blurColor)
      setBlurDataURL(colorBlur)
    }
  }, [src, isStaticImport, blurColor])

  const imageProps = {
    src,
    alt, // Use the prop, don't hardcode "Description of the image"
    className: `${className} transition-all duration-500 ${
      isLoading ? "scale-105 blur-lg" : "scale-100 blur-0"
    }`,
    sizes,
    priority,
    placeholder: "blur" as const,
    // If it's a static import, Next.js provides the blurDataURL automatically
    // If it's a string, we use your custom color placeholder
    blurDataURL: isStaticImport ? undefined : blurDataURL,
    onClick,
    onLoad: () => setIsLoading(false),
  }

  return (
    <div className={`relative overflow-hidden ${fill ? "h-full w-full" : ""}`}>
      {fill ? (
        <Image {...imageProps} fill />
      ) : (
        <Image {...imageProps} width={width} height={height} />
      )}
    </div>
  )
}