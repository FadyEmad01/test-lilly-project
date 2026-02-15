"use client"

import type React from "react"
import { useState, useRef } from "react"
import BlurImage from "./blur-image"
import { Play } from "lucide-react"

interface MediaDisplayProps {
  src: string
  alt: string
  type?: "image" | "video"
  className?: string
  sizes?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  onClick?: () => void
  thumbnail?: string
}

export default function MediaDisplay({
  src,
  alt,
  type = "image",
  className = "",
  sizes,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = false,
  onClick,
  thumbnail,
}: MediaDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [showPlayButton, setShowPlayButton] = useState(!autoPlay)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playPromiseRef = useRef<Promise<void> | null>(null)

  // Determine if it's a video based on file extension or type prop
  const isVideo = type === "video" || src.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)(\?.*)?$/i)

  const handleVideoClick = async (e: React.MouseEvent) => {
    // Always stop event propagation for videos
    e.preventDefault()
    e.stopPropagation()

    if (onClick) {
      onClick()
      return
    }

    const video = videoRef.current
    if (!video) return

    try {
      if (video.paused) {
        // Wait for any previous play promise to resolve before starting new one
        if (playPromiseRef.current) {
          await playPromiseRef.current
        }

        playPromiseRef.current = video.play()
        await playPromiseRef.current

        setIsPlaying(true)
        setShowPlayButton(false)
      } else {
        // Wait for any play promise to resolve before pausing
        if (playPromiseRef.current) {
          await playPromiseRef.current
        }

        video.pause()
        setIsPlaying(false)
        setShowPlayButton(true)
      }
    } catch (error) {
      // Handle any play/pause errors silently
      console.log("Video play/pause error:", error)
    } finally {
      playPromiseRef.current = null
    }
  }

  const handleVideoEnded = () => {
    if (!loop) {
      setIsPlaying(false)
      setShowPlayButton(true)
    }
  }

  const handleVideoError = () => {
    setIsPlaying(false)
    setShowPlayButton(false)
  }

  // Prevent all mouse events from bubbling up when interacting with video
  const handleVideoInteraction = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  if (isVideo) {
    return (
      <div className={`relative ${className}`}>
        {thumbnail && (
          <div className="absolute inset-0 z-0">
            <BlurImage
              src={thumbnail}
              alt={`${alt} thumbnail`}
              fill
              className="object-cover"
              sizes={sizes}
              // isStatic={thumbnail.includes("/placeholder.svg")}
            />
          </div>
        )}
        <video
          ref={videoRef}
          src={src}
          className="relative z-10 w-full h-full object-cover cursor-pointer"
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
          onClick={handleVideoClick}
          onMouseDown={handleVideoInteraction}
          onMouseUp={handleVideoInteraction}
          onDoubleClick={handleVideoInteraction}
          onEnded={handleVideoEnded}
          onError={handleVideoError}
          poster={thumbnail}
        />
        {!controls && showPlayButton && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 cursor-pointer"
            onClick={handleVideoClick}
            onMouseDown={handleVideoInteraction}
            onMouseUp={handleVideoInteraction}
          >
            <div className="bg-white/90 rounded-full p-3 hover:bg-white transition-colors">
              <Play className="w-8 h-8 text-black ml-1" />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      <BlurImage
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover cursor-pointer"
        sizes={sizes}
        // isStatic={src.includes("/placeholder.svg")}
      />
    </div>
  )
}
