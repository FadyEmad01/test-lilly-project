"use client"

import React from "react"

import { X, ExternalLink } from "lucide-react"
import Card from "./card"
import ImageSwiper from "./image-swiper"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import MediaDisplay from "./media-display"
import { useEffect, useRef } from "react"
import { POSTS } from "@/types/post"
// import { ScrollArea } from "../ui/scroll-area"
import Lenis from "lenis"
import { detectSocialPlatform, getSocialIcon } from "@/util/social-icons"
import { getBackgroundClassName, getBackgroundStyle } from "@/util/color-utils"
import { CARDS_POSTS } from "@/constants/POSTS"

interface PostModalProps {
  post: POSTS | null
  isOpen: boolean
  onClose: () => void
  onPostClick: (post: POSTS) => void
}

export default function PostModal({ post, isOpen, onClose, onPostClick }: PostModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const modalWrapperRef = useRef<HTMLDivElement>(null)
  // const scrollPositionRef = useRef<number>(0)
  const lenisRef = useRef<Lenis | null>(null)

  // // Lock/unlock body scroll when modal opens/closes
  // useEffect(() => {
  //   if (isOpen) {
  //     // Save current scroll position
  //     const scrollY = window.scrollY

  //     // Lock body scroll
  //     document.body.style.overflow = "hidden"
  //     document.body.style.position = "fixed"
  //     document.body.style.top = `-${scrollY}px`
  //     document.body.style.width = "100%"

  //     return () => {
  //       // Unlock body scroll and restore position
  //       document.body.style.overflow = ""
  //       document.body.style.position = ""
  //       document.body.style.top = ""
  //       document.body.style.width = ""

  //       // Restore scroll position
  //       window.scrollTo(0, scrollY)
  //     }
  //   }
  // }, [isOpen])

  useEffect(() => {
    if (isOpen && modalWrapperRef.current) {
      const lenis = new Lenis({
        wrapper: modalWrapperRef.current,
        content: modalWrapperRef.current.children[0] as HTMLElement,
        // smooth: true,
      })
      lenisRef.current = lenis

      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)

      return () => {
        lenis.destroy()
        lenisRef.current = null
      }
    }
  }, [isOpen])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])


  if (!post) return null

  // const relatedPosts = posts.filter((p) => p.id !== post.id).slice(0, 3)
  // const relatedPosts = posts.filter((p) => p.id !== post.id)

  const currentIndex = CARDS_POSTS.findIndex((p) => p.id === post.id)
  const relatedPosts = currentIndex !== -1 ? CARDS_POSTS.slice(currentIndex + 1, currentIndex + 4) : []



  const handleRelatedPostClick = (relatedPost: POSTS) => {
    onClose()
    setTimeout(() => {
      onPostClick(relatedPost)
    }, 500)
  }

  const getHeroMedia = () => {
    if (post.heroVideo) {
      return { type: "video" as const, url: post.heroVideo }
    }
    return { type: "image" as const, url: post.heroImage }
  }

  const heroMedia = getHeroMedia()


  // Generate seed (you can use post.id, post.slug, or post.title — whatever is stable and unique)
  const seed = post.id + post.title;

  // Get validated class and style based on backgroundColor or fallback seed
  const backgroundClassName = getBackgroundClassName(post.backgroundColor, seed);
  const backgroundStyle = getBackgroundStyle(post.backgroundColor, seed);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          ref={modalWrapperRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
          className="fixed inset-0 w-full overflow-y-auto min-h-screen z-30 pt-24 md:pt-32 backdrop-blur-3xl "
          onClick={onClose}
        >
          <div className="relative w-full max-w-full mx-auto px-6 xl:px-8 text-black"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.6,
              }}
              className="flex flex-col justify-center items-center relative w-auto"
            >

              <motion.div
                className={`relative w-full max-w-[670px] min-h-[670px] rounded-2xl scroll-mt-64 ${backgroundClassName}`}
                style={backgroundStyle}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}  // Prevent click inside modal from closing
              >
                <div className="p-3 sm:p-8">
                  <header className="flex flex-col gap-y-3.5 mb-24">
                    <div className="flex justify-between gap-x-3.5">
                      <motion.h1
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.3,
                          ease: "easeOut",
                        }}
                        className="text-2xl xl:text-4xl font-semibold uppercase text-ellipsis overflow-hidden line-clamp-2 text-black"
                      >
                        {post.title}
                      </motion.h1>
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.4,
                        }}
                        className="shrink-0 flex items-center justify-center w-9 h-9"
                        type="button"
                        onClick={onClose}
                      >
                        <div className="flex items-center justify-center w-9 h-9 border border-black border-solid rounded-full">
                          {/* <X className="w-6 h-6" /> */}
                          <X className="w-6 h-6 text-black" />
                        </div>
                      </motion.button>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.5,
                      }}
                      className="flex gap-x-1"
                    >
                      <div className="flex gap-1 flex-wrap justify-start">
                        {post.tags.map((tag, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.6 + index * 0.05,
                            }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className={`${backgroundClassName} text-black hover:text-black border-black rounded-full px-3 h-9 hover:rounded-[8px] hover:bg-transparent  transition-all duration-300`}
                              style={backgroundStyle}
                            >
                              <span className="text-xs font-medium uppercase line-clamp-1">{tag}</span>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </header>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.7,
                    }}
                    className="space-y-6"
                  >
                    {(post.heroImage || post.heroVideo) && (
                      <motion.section
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.8,
                        }}
                        className="relative w-full rounded-xl overflow-hidden mb-3.5"
                      >
                        <div className="aspect-square">
                          <MediaDisplay
                            src={heroMedia.url}
                            alt={post.title}
                            type={heroMedia.type}
                            className="w-full h-full"
                            sizes="(max-width: 375px) 310px, 900px"
                            controls={heroMedia.type === "video"}
                            autoPlay={false}
                            muted={false}
                            loop={false}
                          />
                        </div>
                      </motion.section>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.9,
                      }}
                      className="uppercase text-xs mt-1 mb-3.5 flex flex-col"
                    >
                      <span className="line-clamp-1">BY {post.author}</span>
                      <span className="line-clamp-1">PUBLISHED {post.publishedDate}</span>
                    </motion.div>

                    {post.eventInfo && (
                      <motion.section
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: 1.0,
                        }}
                        className="xl:flex text-base whitespace-pre-line mb-3.5 md:mb-8 -mx-3 sm:-mx-8"
                      >
                        <div className="xl:w-1/2 p-3.5 pl-3 sm:pl-8 border-t xl:border-b xl:border-r border-black">
                          <h4 className="text-lg uppercase mb-1 font-semibold line-clamp-1">When</h4>
                          <p className="text-base line-clamp-3">{post.eventInfo.when}</p>
                        </div>
                        <div className="xl:w-1/2 p-3.5 pr-3 sm:pl-8 xl:pl-3 border-y border-black">
                          <h4 className="text-lg uppercase mb-1 font-semibold line-clamp-1">Where</h4>
                          <p className="text-base line-clamp-3">{post.eventInfo.where}</p>
                        </div>
                      </motion.section>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 1.1,
                      }}
                      className="prose prose-lg max-w-none"
                    >
                      {/* {post.content && (
                        <div>
                          {post.content.split("\n\n").map((paragraph, index) => (
                            <motion.p
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: 1.2 + index * 0.1,
                              }}
                              className="mb-4 text-base leading-relaxed"
                            >
                              {paragraph}
                            </motion.p>
                          ))}
                        </div>
                      )} */}

                      {/* {post.content && (
                        <div>
                          {post.content.split(/\n\n+/).map((block, blockIndex) => (
                            <motion.p
                              key={blockIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: 1.2 + blockIndex * 0.1,
                              }}
                              className="mb-4 text-base leading-relaxed"
                            >
                              {block
                                .split(/(?=•)/g) // split before each • and keep it
                                .map((line, index) => (
                                  <div key={index}>
                                    {index < 0 && <br />}
                                    {line.trim()}
                                  </div>
                                ))
                                }
                            </motion.p>
                          ))}
                        </div>
                      )} */}

                      {post.content && (
                        <div>
                          {post.content.split(/\n\n+/).map((block, blockIndex) => (
                            <motion.p
                              key={blockIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: 1.2 + blockIndex * 0.1,
                              }}
                              className="mb-4 text-base leading-relaxed"
                            >
                              {block
                                .split(/\n+/g) // split on single line breaks
                                .map((line, index) => (
                                  <React.Fragment key={index}>
                                    {index > 0 && <br />}
                                    {line.trim()}
                                  </React.Fragment>
                                ))}
                            </motion.p>
                          ))}
                        </div>
                      )}



                    </motion.div>

                    {((post.images && post.images.length > 0) ||
                      (post.videos && post.videos.length > 0) ||
                      (post.media && post.media.length > 0)) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            duration: 0.5,
                            delay: 1.5,
                          }}
                        >
                          <ImageSwiper images={post.images} videos={post.videos} media={post.media} alt={post.title} />
                        </motion.div>
                      )}

                    {post.externalUrl && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 1.6,
                        }}
                        className="flex flex-col items-start gap-y-3.5 my-6"
                      >
                        <Button
                          asChild
                          variant="default"
                          size="sm"
                          // className="bg-black text-white hover:bg-gray-800 rounded-full px-4 h-8"
                          className="text-black border-black bg-transparent hover:bg-transparent border border-solid rounded-full px-3 h-9 transition-colors flex justify-center items-center whitespace-nowrap hover:rounded-[8px] duration-300"
                        >
                          <a target="_blank" rel="noopener noreferrer" href={post.externalUrl}>
                            <span className="text-xs uppercase mr-2 line-clamp-1">LEARN MORE</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      </motion.div>
                    )}

                    {/* Social Links */}
                    {post.socialLinks && post.socialLinks.length > 0 && (
                      // <div className="flex flex-col items-start gap-y-3.5 my-6">
                      <div className="flex items-start gap-1 my-6 flex-wrap">
                        {post.socialLinks.map((link, index) => {
                          const platform = link.platform || detectSocialPlatform(link.url)
                          const icon = getSocialIcon(platform, "w-3 h-3")

                          return (
                            <div key={index}>
                              <Button
                                asChild
                                variant="default"
                                size="sm"
                                // className="bg-black text-white hover:bg-gray-800 rounded-full px-4 h-8"
                                className="text-black border-black bg-transparent hover:bg-transparent border border-solid rounded-full px-3 h-9 transition-colors flex justify-center items-center whitespace-nowrap hover:rounded-[8px] duration-300"
                              >
                                <a target="_blank" rel="noopener noreferrer" href={link.url}>
                                  <span className="text-xs uppercase mr-2 line-clamp-1">{link.label}</span>
                                  {icon}
                                </a>
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>

              {relatedPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.6,
                    delay: 2.0,
                  }}
                  className={`w-full max-w-[670px] rounded-2xl ${backgroundClassName} mt-7`}
                  style={backgroundStyle}
                  onClick={(e) => e.stopPropagation()}  // Prevent click inside modal from closing
                >
                  <div className="py-3.5 md:py-7.5">
                    <h4 className="text-lg font-semibold uppercase ml-3.5 md:ml-7.5 mb-3.5 line-clamp-1">
                      WHILE YOU'RE HERE…
                    </h4>
                    <div className="flex space-x-3.5 px-3.5 md:px-7.5 overflow-x-scroll hidden-scroll pointer-events-auto">
                      {relatedPosts.map((relatedPost, index) => (
                        <motion.div
                          key={relatedPost.id}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{
                            duration: 0.4,
                            delay: 2.1 + index * 0.1,
                          }}
                          className="flex-shrink-0"
                        >
                          <Card
                            post={relatedPost}
                            onClick={() => handleRelatedPostClick(relatedPost)}
                            isRelated={true}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="mb-8"></div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

}
