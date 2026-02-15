"use client"

import { POSTS } from "@/types/POSTS"
import { useState } from "react"
import Card from "./card"
import PostModal from "./post-modal"
import { useRouter, useSearchParams } from "next/navigation"
import React from "react"
import { Suspense } from "react";
import { Spinner } from "../ui/spinner"

interface CardGridProps {
  posts: POSTS[]
}

export default function CardGrid({ posts }: CardGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPost, setSelectedPost] = useState<POSTS | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open modal if ?post=slug is in the URL
  React.useEffect(() => {
    const slug = searchParams.get("post");
    if (slug) {
      const found = posts.find((p) => p.slug === slug);
      if (found) {
        setSelectedPost(found);
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);
        setSelectedPost(null);
      }
    } else {
      setIsModalOpen(false);
      setSelectedPost(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, posts]);

  const handleCardClick = (post: POSTS) => {
    // if (post.cardType === "newsletter") return;
    setSelectedPost(post);
    setIsModalOpen(true);
    // Update URL with ?post=slug, but do not scroll
    router.push(`/docs?post=${post.slug}`, { scroll: false });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    // Remove ?post param from URL, but do not scroll
    router.push("/docs", { scroll: false });
  };

  return (
    <>
      {/* Mobile Layout - Single Column */}
      <div className="md:hidden w-full flex flex-col items-center space-y-4 px-4">
        {posts.map((post) => (
          // mb-3.5
          <div key={post.id} className="mb-[80px] flex justify-center">
            <Card post={post} onClick={() => handleCardClick(post)} />
          </div>
        ))}
      </div>

      {/* Desktop Layout - Masonry Grid */}
      <div className="hidden md:block infinite-scroll-component w-full flex-col gap-y-[-100px] items-center xl:items-baseline max-w-[1215px]">
        {posts
          .reduce((rows: POSTS[][], post, index) => {
            // Try to pair posts randomly - mix large and small cards
            let targetRowIndex = rows.length - 1

            // If no rows exist or last row is full (2 cards), create new row
            if (targetRowIndex < 0 || rows[targetRowIndex].length >= 2) {
              rows.push([])
              targetRowIndex = rows.length - 1
            }

            rows[targetRowIndex].push(post)
            return rows
          }, [])
          .map((rowPosts, rowIndex) => {
            const isEvenRow = rowIndex % 2 === 0

            return (
              <div key={rowIndex} className="flex w-full gap-x-[100px] mb-20">
                {isEvenRow ? (
                  <>
                    <div className="w-full h-full flex items-start mb-[80px] flex-[4] justify-end">
                      {rowPosts[0] && (
                        <div className="flex justify-center fit-content w-full">
                          <Card post={rowPosts[0]} onClick={() => handleCardClick(rowPosts[0])} />
                        </div>
                      )}
                    </div>
                    {rowPosts[1] && (
                      <div className="w-full h-full flex items-start mt-[80px] flex-[3] justify-start">
                        <Card post={rowPosts[1]} onClick={() => handleCardClick(rowPosts[1])} />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {rowPosts[0] && (
                      <div className="w-full h-full flex items-start flex-[3] justify-end">
                        <Card post={rowPosts[0]} onClick={() => handleCardClick(rowPosts[0])} />
                      </div>
                    )}
                    {rowPosts[1] && (
                      <div className="w-full h-full flex items-start mt-[80px] flex-[4] justify-start">
                        <div className="flex justify-center fit-content w-full">
                          <Card post={rowPosts[1]} onClick={() => handleCardClick(rowPosts[1])} />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
      </div>

      <PostModal post={selectedPost} isOpen={isModalOpen} onClose={handleCloseModal} onPostClick={handleCardClick} />
    </>
  )
}

export function CardGridWrap(props: CardGridProps) {
  return (
    <Suspense fallback={<Spinner/>}>
      <CardGrid {...props} />
    </Suspense>
  );
}
