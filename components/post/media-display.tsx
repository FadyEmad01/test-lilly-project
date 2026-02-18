// "use client"

// import type React from "react"
// import { useState, useRef } from "react"
// import BlurImage from "./blur-image"
// import { Play } from "lucide-react"

// interface MediaDisplayProps {
//   src: string
//   alt: string
//   type?: "image" | "video"
//   className?: string
//   sizes?: string
//   autoPlay?: boolean
//   muted?: boolean
//   loop?: boolean
//   controls?: boolean
//   onClick?: () => void
//   thumbnail?: string
// }

// export default function MediaDisplay({
//   src,
//   alt,
//   type = "image",
//   className = "",
//   sizes,
//   autoPlay = false,
//   muted = true,
//   loop = false,
//   controls = false,
//   onClick,
//   thumbnail,
// }: MediaDisplayProps) {
//   const [isPlaying, setIsPlaying] = useState(autoPlay)
//   const [showPlayButton, setShowPlayButton] = useState(!autoPlay)
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const playPromiseRef = useRef<Promise<void> | null>(null)

//   // Determine if it's a video based on file extension or type prop
//   const isVideo = type === "video" || src.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)(\?.*)?$/i)

//   const handleVideoClick = async (e: React.MouseEvent) => {
//     // Always stop event propagation for videos
//     e.preventDefault()
//     e.stopPropagation()

//     if (onClick) {
//       onClick()
//       return
//     }

//     const video = videoRef.current
//     if (!video) return

//     try {
//       if (video.paused) {
//         // Wait for any previous play promise to resolve before starting new one
//         if (playPromiseRef.current) {
//           await playPromiseRef.current
//         }

//         playPromiseRef.current = video.play()
//         await playPromiseRef.current

//         setIsPlaying(true)
//         setShowPlayButton(false)
//       } else {
//         // Wait for any play promise to resolve before pausing
//         if (playPromiseRef.current) {
//           await playPromiseRef.current
//         }

//         video.pause()
//         setIsPlaying(false)
//         setShowPlayButton(true)
//       }
//     } catch (error) {
//       // Handle any play/pause errors silently
//       console.log("Video play/pause error:", error)
//     } finally {
//       playPromiseRef.current = null
//     }
//   }

//   const handleVideoEnded = () => {
//     if (!loop) {
//       setIsPlaying(false)
//       setShowPlayButton(true)
//     }
//   }

//   const handleVideoError = () => {
//     setIsPlaying(false)
//     setShowPlayButton(false)
//   }

//   // Prevent all mouse events from bubbling up when interacting with video
//   const handleVideoInteraction = (e: React.MouseEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//   }

//   if (isVideo) {
//     return (
//       <div className={`relative ${className}`}>
//         {thumbnail && (
//           <div className="absolute inset-0 z-0">
//             <BlurImage
//               src={thumbnail}
//               alt={`${alt} thumbnail`}
//               fill
//               className="object-cover"
//               sizes={sizes}
//               // isStatic={thumbnail.includes("/placeholder.svg")}
//             />
//           </div>
//         )}
//         <video
//           ref={videoRef}
//           src={src}
//           className="relative z-10 w-full h-full object-cover cursor-pointer"
//           autoPlay={autoPlay}
//           muted={muted}
//           loop={loop}
//           controls={controls}
//           playsInline
//           onClick={handleVideoClick}
//           onMouseDown={handleVideoInteraction}
//           onMouseUp={handleVideoInteraction}
//           onDoubleClick={handleVideoInteraction}
//           onEnded={handleVideoEnded}
//           onError={handleVideoError}
//           poster={thumbnail}
//         />
//         {!controls && showPlayButton && (
//           <div
//             className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 cursor-pointer"
//             onClick={handleVideoClick}
//             onMouseDown={handleVideoInteraction}
//             onMouseUp={handleVideoInteraction}
//           >
//             <div className="bg-white/90 rounded-full p-3 hover:bg-white transition-colors">
//               <Play className="w-8 h-8 text-black ml-1" />
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   return (
//     <div className={`relative ${className}`} onClick={onClick}>
//       <BlurImage
//         src={src || "/placeholder.svg"}
//         alt={alt}
//         fill
//         className="object-cover cursor-pointer"
//         sizes={sizes}
//         // isStatic={src.includes("/placeholder.svg")}
//       />
//     </div>
//   )
// }

"use client"

import type React from "react"
import { useState, useRef } from "react"
import BlurImage from "./blur-image"
import { Play, FileText, Download, Maximize2, ExternalLink } from "lucide-react"

interface MediaDisplayProps {
  src: string
  alt: string
  type?: "image" | "video" | "pdf" | "pptx" | "document"
  className?: string
  sizes?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  onClick?: () => void
  thumbnail?: string
  showDownload?: boolean
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
  showDownload = true,
}: MediaDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [showPlayButton, setShowPlayButton] = useState(!autoPlay)
  const [pdfError, setPdfError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const playPromiseRef = useRef<Promise<void> | null>(null)

  // Determine media type based on file extension or type prop
  const getMediaType = (): "image" | "video" | "pdf" | "pptx" => {
    if (type && type !== "document") return type as "image" | "video" | "pdf" | "pptx"
    
    if (src.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)(\?.*)?$/i)) return "video"
    if (src.match(/\.(pdf)(\?.*)?$/i)) return "pdf"
    if (src.match(/\.(pptx?|ppt)(\?.*)?$/i)) return "pptx"
    
    return "image"
  }

  const mediaType = getMediaType()
  const isVideo = mediaType === "video"
  const isPdf = mediaType === "pdf"
  const isPptx = mediaType === "pptx"

  const handleVideoClick = async (e: React.MouseEvent) => {
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
        if (playPromiseRef.current) {
          await playPromiseRef.current
        }

        playPromiseRef.current = video.play()
        await playPromiseRef.current

        setIsPlaying(true)
        setShowPlayButton(false)
      } else {
        if (playPromiseRef.current) {
          await playPromiseRef.current
        }

        video.pause()
        setIsPlaying(false)
        setShowPlayButton(true)
      }
    } catch (error) {
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

  const handleVideoInteraction = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handlePdfError = () => {
    setPdfError(true)
  }

  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!containerRef.current) return

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.log("Fullscreen error:", error)
    }
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Create a temporary anchor element for download
    const link = document.createElement('a')
    link.href = src
    link.download = getFileName()
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openInNewTab = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(src, '_blank')
  }

  const getFileName = () => {
    return src.split("/").pop() || "document"
  }

  // PDF Renderer
  if (isPdf) {
    if (pdfError) {
      return (
        <div className={`relative bg-gray-100 ${className}`}>
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-6">
            <FileText className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-gray-700 font-medium mb-2">PDF Preview Unavailable</p>
            <p className="text-gray-500 text-sm mb-4 text-center">
              Your browser may not support inline PDF viewing
            </p>
            <div className="flex gap-2">
              <button
                onClick={openInNewTab}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </button>
              {showDownload && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div ref={containerRef} className={`relative bg-gray-100 ${className}`}>
        {/* PDF Toolbar */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gray-800/90 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium truncate max-w-[200px]">
              {alt || getFileName()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-700 rounded transition"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={openInNewTab}
              className="p-2 hover:bg-gray-700 rounded transition"
              title="Open in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            {showDownload && (
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-gray-700 rounded transition"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* PDF Embed using iframe */}
        <iframe
          ref={iframeRef}
          src={`${src}#toolbar=0&navpanes=0&scrollbar=1`}
          className="w-full h-full min-h-[500px] pt-10"
          title={alt || "PDF Document"}
          onError={handlePdfError}
          style={{ border: "none" }}
        />
      </div>
    )
  }

  // PPTX Renderer
  if (isPptx) {
    const isLocalFile = src.startsWith("/") || src.startsWith("./")
    
    // For local PPTX files, use Google Docs Viewer or Office Online
    const getViewerUrl = () => {
      // For local files, we need the full URL
      const fullUrl = isLocalFile 
        ? `${window.location.origin}${src}` 
        : src

      // Google Docs Viewer (works better for local files)
      return `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`
      
      // Alternative: Microsoft Office Online Viewer
      // return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fullUrl)}`
    }

    const [viewerError, setViewerError] = useState(false)

    if (viewerError) {
      return (
        <div className={`relative bg-gradient-to-br from-orange-50 to-orange-100 ${className}`}>
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-6">
            <div className="w-20 h-20 bg-orange-500 rounded-lg flex items-center justify-center mb-4 shadow-lg">
              <span className="text-white font-bold text-2xl">PPT</span>
            </div>
            <p className="text-gray-700 font-medium mb-2 text-center">{alt || getFileName()}</p>
            <p className="text-gray-500 text-sm mb-4 text-center">
              PowerPoint viewer unavailable
            </p>
            <div className="flex gap-2">
              <button
                onClick={openInNewTab}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </button>
              {showDownload && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  <Download className="w-4 h-4" />
                  Download PPTX
                </button>
              )}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div ref={containerRef} className={`relative bg-gray-100 ${className}`}>
        {/* PPTX Toolbar */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-orange-600/90 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <span className="text-orange-600 font-bold text-xs">PPT</span>
            </div>
            <span className="text-sm font-medium truncate max-w-[200px]">
              {alt || getFileName()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-orange-700 rounded transition"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={openInNewTab}
              className="p-2 hover:bg-orange-700 rounded transition"
              title="Open in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            {showDownload && (
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-orange-700 rounded transition"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* PPTX Embed */}
        <iframe
          ref={iframeRef}
          src={getViewerUrl()}
          className="w-full h-full min-h-[500px] pt-10"
          title={alt || "PowerPoint Presentation"}
          style={{ border: "none" }}
          allowFullScreen
          onError={() => setViewerError(true)}
        />
      </div>
    )
  }

  // Video Renderer
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

  // Image Renderer (default)
  return (
    <div className={`relative ${className}`} onClick={onClick}>
      <BlurImage
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover cursor-pointer"
        sizes={sizes}
      />
    </div>
  )
}