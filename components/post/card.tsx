// "use client"

// import { Play, Eye } from "lucide-react"
// import MediaDisplay from "./media-display"
// import { POSTS } from "@/types/POSTS"
// import { getBackgroundClassName, getBackgroundStyle } from "@/util/color-utils"

// interface CardProps {
//   post: POSTS
//   onClick: () => void
//   isRelated?: boolean
// }

// // --- Shared Sub-Components (Internal Only) ---

// const TagList = ({ tags, bgClassName, bgStyle, isRelated }: any) => (
//   <div className="flex gap-1 flex-wrap justify-start w-full">
//     {tags.map((tag: string, index: number) => (
//       <button
//         key={index}
//         type="button"
//         className={`${isRelated ? "bg-transparent" : bgClassName} text-black border-black border border-solid rounded-full px-3 h-9 transition-colors flex justify-center items-center whitespace-nowrap hover:rounded-[8px] duration-300`}
//         style={isRelated ? {} : bgStyle}
//       >
//         <p className="text-xs font-medium uppercase line-clamp-1">{tag}</p>
//       </button>
//     ))}
//   </div>
// )

// const ActionButton = ({ icon: Icon, size = "w-6 h-6" }: any) => (
//   <button className="flex items-center justify-center w-9 h-9" type="button">
//     <div className="flex items-center justify-center w-9 h-9 border border-current border-solid rounded-full">
//       <Icon className={size} />
//     </div>
//   </button>
// )

// const MediaSection = ({ src, alt, type, className, sizes, onClick }: any) => (
//   <div className={`relative overflow-hidden rounded-sm z-0 ${className}`}>
//     <MediaDisplay
//       src={src}
//       alt={alt}
//       type={type}
//       className="w-full h-full"
//       sizes={sizes}
//       autoPlay={type === "video"}
//       muted={true}
//       loop={true}
//       onClick={onClick}
//     />
//   </div>
// )

// // --- Main Component ---

// export default function Card({ post, onClick, isRelated = false }: CardProps) {
//   const heroMedia = post.heroVideo
//     ? { type: "video" as const, src: post.heroVideo }
//     : { type: "image" as const, src: post.heroImage }

//   const seed = post.id + post.title
//   const backgroundClassName = getBackgroundClassName(post.backgroundColor, seed)
//   const backgroundStyle = getBackgroundStyle(post.backgroundColor, seed)

//   const commonWrapper = `mp-card relative cursor-pointer rounded-2xl flex-shrink-0 sm:w-[325px] w-[300px] h-[475px]`

//   // // 1. NEWSLETTER CARD
//   // if (post.cardType === "newsletter") {
//   //   return (
//   //     <div
//   //       className={`${commonWrapper} text-black ${backgroundClassName} border border-gray-700`}
//   //       style={backgroundStyle}
//   //     >
//   //       <div className="h-full flex flex-col justify-between p-3.5">
//   //         <h2 className="text-2xl lg:text-3xl font-semibold uppercase text-ellipsis overflow-hidden line-clamp-4 max-h-[140px] pr-1">
//   //           {post.title}
//   //         </h2>
//   //         <form className="space-y-4">
//   //           <div className="relative flex items-center">
//   //             <input
//   //               className="w-full text-lg placeholder:text-black dark:placeholder:text-white bg-white dark:bg-gray-900 pr-14 pb-3.5 pt-4 pl-3.5 border border-solid border-black dark:border-white rounded-full"
//   //               placeholder="YOUR EMAIL"
//   //               type="email"
//   //             />
//   //             <button className="absolute right-3.5 flex items-center justify-center w-9 h-9" type="submit">
//   //               <Play className="w-6 h-6" />
//   //             </button>
//   //           </div>
//   //         </form>
//   //       </div>
//   //     </div>
//   //   )
//   // }

//   // 2. SOCIAL CARD
//   if (post.cardType === "social") {
//     return (
//       <div
//         className={`${commonWrapper} text-black ${isRelated ? "bg-transparent border border-black" : backgroundClassName}`}
//         style={isRelated ? {} : backgroundStyle}
//         onClick={onClick}
//       >
//         <div className="flex p-3.5 h-full flex-col gap-y-3.5">
//           <MediaSection
//             {...heroMedia}
//             alt={post.title}
//             className="w-full h-[397px]"
//             sizes="(max-width: 768px) 100vw, 325px"
//             onClick={onClick}
//           />
//           <footer className="flex justify-between">
//             <button className="text-lg uppercase text-ellipsis overflow-hidden self-center line-clamp-1">
//               {post.socialHandle}
//             </button>
//             <ActionButton icon={Play} size="w-5 h-5" />
//           </footer>
//         </div>
//       </div>
//     )
//   }

//   // 3. LARGE CARD
//   if (post.size === "large" && !isRelated) {
//     return (
//       <div
//         className={`${commonWrapper} xl:max-w-[670px] xl:w-full text-black ${backgroundClassName}`}
//         style={backgroundStyle}
//         onClick={onClick}
//       >
//         {/* Desktop Layout */}
//         <div className="hidden xl:flex p-3.5 h-full gap-x-3.5">
//           {(post.heroImage || post.heroVideo) && (
//             <MediaSection {...heroMedia} alt={post.title} className="h-full w-[308px]" sizes="308px" onClick={onClick} />
//           )}
//           <div className="flex-1 flex flex-col justify-between">
//             <h2 className="text-2xl lg:text-3xl font-semibold uppercase text-ellipsis overflow-hidden line-clamp-4 max-h-[140px]">
//               {post.title}
//             </h2>
//             <footer className="flex justify-between">
//               <TagList tags={post.tags} bgClassName={backgroundClassName} bgStyle={backgroundStyle} />
//               <ActionButton icon={Eye} />
//             </footer>
//           </div>
//         </div>

//         {/* Mobile Layout */}
//         <div className="flex xl:hidden h-full p-3.5 flex-col-reverse gap-y-3.5">
//           <footer className="flex justify-between">
//             <TagList tags={post.tags} bgClassName={backgroundClassName} bgStyle={backgroundStyle} />
//             <ActionButton icon={Eye} />
//           </footer>
//           {(post.heroImage || post.heroVideo) && (
//             <MediaSection {...heroMedia} alt={post.title} className="h-[210px] w-full" sizes="(max-width: 768px) 100vw, 325px" onClick={onClick} />
//           )}
//           <div className="flex-1 flex flex-col justify-between overflow-hidden">
//             <div>
//               <h2 className="text-2xl lg:text-3xl font-semibold uppercase text-ellipsis overflow-hidden line-clamp-3 max-h-[140px]">
//                 {post.title}
//               </h2>
//               {post.description && <p className="text-lg uppercase text-ellipsis overflow-hidden mt-2 line-clamp-2">{post.description}</p>}
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // 4. REGULAR / RELATED CARD
//   return (
//     <div
//       className={`${commonWrapper} text-black ${isRelated ? "bg-transparent border border-black" : backgroundClassName}`}
//       style={isRelated ? {} : backgroundStyle}
//       onClick={onClick}
//     >
//       <div className="flex h-full p-3.5 flex-col-reverse gap-y-3.5">
//         <footer className="flex justify-between">
//           <TagList tags={post.tags} bgClassName={backgroundClassName} bgStyle={backgroundStyle} isRelated={isRelated} />
//           <ActionButton icon={Eye} />
//         </footer>
//         {(post.heroImage || post.heroVideo) && (
//           <MediaSection {...heroMedia} alt={post.title} className="h-[210px] w-full" sizes="(max-width: 768px) 100vw, 325px" onClick={onClick} />
//         )}
//         <div className="flex-1 flex flex-col justify-between">
//           <div>
//             <h2 className="text-2xl lg:text-3xl font-semibold uppercase text-ellipsis overflow-hidden line-clamp-4 max-h-[140px]">
//               {post.title}
//             </h2>
//             {post.description && <p className="text-lg uppercase text-ellipsis overflow-hidden mt-2 line-clamp-2">{post.description}</p>}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { Play, Eye } from "lucide-react"
import MediaDisplay from "./media-display"
import { POSTS } from "@/types/post"
import { getBackgroundClassName, getBackgroundStyle } from "@/util/color-utils"

interface CardProps {
  post: POSTS
  onClick: () => void
  isRelated?: boolean
}

// --- Shared Sub-Components (Internal Only) ---

const CardTitle = ({ 
  children, 
  lineClamp = 4 
}: { 
  children: React.ReactNode
  lineClamp?: 3 | 4 
}) => {
  const lineClampClass = lineClamp === 3 ? "line-clamp-3" : "line-clamp-4"
  return (
    <h2 className={`text-3xl lg:text-4xl font-bold uppercase text-ellipsis text-balance ${lineClampClass}`}>
      {children}
    </h2>
  )
}

const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-base uppercase text-ellipsis text-pretty mt-2 line-clamp-2">
    {children}
  </p>
)

const CardContent = ({ 
  title, 
  description, 
  lineClamp = 4 
}: { 
  title: string
  description?: string
  lineClamp?: 3 | 4 
}) => (
  <div className="flex-1 flex flex-col justify-between overflow-hidden">
    <div>
      <CardTitle lineClamp={lineClamp}>{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </div>
  </div>
)

const CardFooter = ({ children }: { children: React.ReactNode }) => (
  <footer className="flex justify-between">
    {children}
  </footer>
)

const TagList = ({ 
  tags, 
  bgClassName, 
  bgStyle, 
  isRelated 
}: { 
  tags: string[]
  bgClassName: string
  bgStyle: React.CSSProperties
  isRelated?: boolean 
}) => (
  <div className="flex gap-1 flex-wrap justify-start w-full po">
    {tags.map((tag, index) => (
      <button
        key={index}
        type="button"
        className={`${isRelated ? "bg-transparent" : bgClassName} text-black border-black border border-solid rounded-full px-3 h-9 transition-colors flex justify-center items-center whitespace-nowrap hover:rounded-[8px] duration-300 `}
        style={isRelated ? {} : bgStyle}
      >
        <p className="text-xs font-medium uppercase line-clamp-1">{tag}</p>
      </button>
    ))}
  </div>
)

const ActionButton = ({ 
  icon: Icon, 
  size = "w-6 h-6" 
}: { 
  icon: React.ElementType
  size?: string 
}) => (
  <button className="flex items-center justify-center w-9 h-9" type="button">
    <div className="flex items-center justify-center w-9 h-9 border border-current border-solid rounded-full">
      <Icon className={size} />
    </div>
  </button>
)

const MediaSection = ({ 
  src, 
  alt, 
  type, 
  className, 
  sizes, 
  onClick 
}: { 
  src: string
  alt: string
  type: "image" | "video"
  className: string
  sizes: string
  onClick?: () => void 
}) => (
  <div className={`relative overflow-hidden rounded-sm z-0 ${className}`}>
    <MediaDisplay
      src={src}
      alt={alt}
      type={type}
      className="w-full h-full"
      sizes={sizes}
      autoPlay={type === "video"}
      muted={true}
      loop={true}
      onClick={onClick}
    />
  </div>
)

// --- Main Component ---

export default function Card({ post, onClick, isRelated = false }: CardProps) {
  const heroMedia = post.heroVideo
    ? { type: "video" as const, src: post.heroVideo }
    : { type: "image" as const, src: post.heroImage }

  const seed = post.id + post.title
  const backgroundClassName = getBackgroundClassName(post.backgroundColor, seed)
  const backgroundStyle = getBackgroundStyle(post.backgroundColor, seed)

  const commonWrapper = `relative cursor-pointer rounded-2xl flex-shrink-0 sm:w-[325px] w-full min-w-[260px] h-[475px]`
  const hasMedia = post.heroImage || post.heroVideo

  // 1. SOCIAL CARD
  if (post.cardType === "social") {
    return (
      <div
        className={`${commonWrapper} text-black ${isRelated ? "bg-transparent border border-black" : backgroundClassName}`}
        style={isRelated ? {} : backgroundStyle}
        onClick={onClick}
      >
        <div className="flex p-3.5 h-full flex-col gap-y-3.5">
          <MediaSection
            {...heroMedia}
            alt={post.title}
            className="w-full h-[397px]"
            sizes="(max-width: 768px) 100vw, 325px"
            onClick={onClick}
          />
          <CardFooter>
            <button className="text-lg uppercase text-ellipsis overflow-hidden self-center line-clamp-1">
              {post.socialHandle}
            </button>
            <ActionButton icon={Play} size="w-5 h-5" />
          </CardFooter>
        </div>
      </div>
    )
  }

  // 2. LARGE CARD
  if (post.size === "large" && !isRelated) {
    return (
      <div
        className={`${commonWrapper} xl:max-w-[670px] xl:w-full text-black ${backgroundClassName}`}
        style={backgroundStyle}
        onClick={onClick}
      >
        {/* Desktop Layout */}
        <div className="hidden xl:flex p-3.5 h-full gap-x-3.5">
          {hasMedia && (
            <MediaSection
              {...heroMedia}
              alt={post.title}
              className="h-full w-[308px]"
              sizes="308px"
              onClick={onClick}
            />
          )}
          <div className="flex-1 flex flex-col justify-between">
            <CardTitle>{post.title}</CardTitle>
            <CardFooter>
              <TagList
                tags={post.tags}
                bgClassName={backgroundClassName}
                bgStyle={backgroundStyle}
              />
              <ActionButton icon={Eye} />
            </CardFooter>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex xl:hidden h-full p-3.5 flex-col-reverse gap-y-3.5">
          <CardFooter>
            <TagList
              tags={post.tags}
              bgClassName={backgroundClassName}
              bgStyle={backgroundStyle}
            />
            <ActionButton icon={Eye} />
          </CardFooter>
          {hasMedia && (
            <MediaSection
              {...heroMedia}
              alt={post.title}
              className="h-[210px] w-full"
              sizes="(max-width: 768px) 100vw, 325px"
              onClick={onClick}
            />
          )}
          <CardContent
            title={post.title}
            description={post.description}
            lineClamp={3}
          />
        </div>
      </div>
    )
  }

  // 3. REGULAR / RELATED CARD
  return (
    <div
      className={`${commonWrapper} text-black ${isRelated ? "bg-transparent border border-black" : backgroundClassName}`}
      style={isRelated ? {} : backgroundStyle}
      onClick={onClick}
    >
      <div className="flex h-full p-3.5 flex-col-reverse gap-y-3.5">
        <CardFooter>
          <TagList
            tags={post.tags}
            bgClassName={backgroundClassName}
            bgStyle={backgroundStyle}
            isRelated={isRelated}
          />
          <ActionButton icon={Eye} />
        </CardFooter>
        {hasMedia && (
          <MediaSection
            {...heroMedia}
            alt={post.title}
            className="h-[210px] w-full"
            sizes="(max-width: 768px) 100vw, 325px"
            onClick={onClick}
          />
        )}
        <CardContent
          title={post.title}
          description={post.description}
        />
      </div>
    </div>
  )
}